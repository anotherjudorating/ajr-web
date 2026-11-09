// Every call of the site to the database (lib/api.ts) goes through `call`, so the
// database never gets more than it can answer (docs: ajr-backend
// docs/audits/2026-11-08-frontend-data-client.md). PostgREST has a pool of 10
// connections on Supabase Nano: when more calls arrive than it can serve, they wait
// for a connection for 10 s and fail with 504, pages hang for 15-30 s, and retries
// make it worse (2026-11-08: the Data API was down for ~16 minutes). Here:
//
// - at most `limit` calls run at once, the others wait in a bounded queue for at most
//   `queueWaitMs`, then fail fast;
// - a call that has no answer after `callDeadlineMs` is given up: the statement limit
//   is 3 s, a longer wait is a stuck Data API, not a slow query;
// - a circuit breaker: `breakerFailures` failures within `breakerWindowMs` and every
//   call fails at once for `breakerOpenMs`, then one probe decides (so a saturated
//   database gets no new load while it recovers);
// - `overloaded()` lets proxy.ts send crawlers a 503 with Retry-After instead of a
//   hanging page.
//
// Identical concurrent calls need no deduplication here: Next's "use cache" already
// shares one call between them. The state is per process (one instance on Render) and
// lives on globalThis, which proxy.ts and /api/health see too.

const BUILDING = process.env.NEXT_PHASE === "phase-production-build";

type Outcome = "ok" | "timeout" | "pool" | "statement" | "server" | "network" | "shed" | "open" | "client";

type Config = {
  limit: number; // calls at once (the pool is 10: room for the update job)
  queueMax: number; // calls waiting beyond the limit; more fail at once
  queueWaitMs: number; // a call waiting longer fails (the page fails fast instead of hanging)
  callDeadlineMs: number; // statement limit 3 s + waiting for a pool connection
  breakerFailures: number; // within breakerWindowMs, open the breaker
  breakerWindowMs: number;
  breakerOpenMs: number; // calls fail fast this long, then one probe
};

const number = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const CONFIG: Config = {
  // while the site is built, each build worker (next.config.ts cpus) has its own
  // client: one call at a time each, and patience, as nobody is waiting
  limit: BUILDING ? 1 : number("AJR_DB_LIMIT", 6),
  queueMax: BUILDING ? 1000 : number("AJR_DB_QUEUE", 40),
  queueWaitMs: BUILDING ? 600_000 : number("AJR_DB_QUEUE_WAIT_MS", 4000),
  callDeadlineMs: number("AJR_DB_DEADLINE_MS", 10_000),
  breakerFailures: number("AJR_DB_BREAKER_FAILURES", 5),
  breakerWindowMs: number("AJR_DB_BREAKER_WINDOW_MS", 10_000),
  breakerOpenMs: number("AJR_DB_BREAKER_OPEN_MS", 15_000),
};

// What a page gets when the database cannot answer now (rather than a hang).
export class DataUnavailable extends Error {
  constructor(
    readonly outcome: Outcome,
    message: string,
  ) {
    super(message);
    this.name = "DataUnavailable";
  }
}

type Waiter = { resolve: () => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

class Client {
  inflight = 0;
  queue: Waiter[] = [];
  state: "closed" | "open" | "half-open" = "closed";
  failures: number[] = []; // times, within the window
  openedAt = 0;
  probing = false;
  // for /api/health
  counts: Record<Outcome, number> = {
    ok: 0, timeout: 0, pool: 0, statement: 0, server: 0, network: 0, shed: 0, open: 0, client: 0,
  }; // prettier-ignore
  maxInflight = 0;
  maxQueue = 0;
  trips = 0;
  latencies: number[] = []; // the last 500 answered calls, ms
  lastError = "";

  constructor(readonly config: Config) {}

  async acquire(): Promise<void> {
    if (this.inflight < this.config.limit) {
      this.inflight++;
      this.maxInflight = Math.max(this.maxInflight, this.inflight);
      return;
    }
    if (this.queue.length >= this.config.queueMax) {
      this.counts.shed++;
      throw new DataUnavailable("shed", `queue full (${this.queue.length} waiting)`);
    }
    await new Promise<void>((resolve, reject) => {
      const waiter: Waiter = {
        resolve,
        reject,
        timer: setTimeout(() => {
          this.queue.splice(this.queue.indexOf(waiter), 1);
          this.counts.shed++;
          reject(new DataUnavailable("shed", `waited ${this.config.queueWaitMs} ms for a slot`));
        }, this.config.queueWaitMs),
      };
      this.queue.push(waiter);
      this.maxQueue = Math.max(this.maxQueue, this.queue.length);
    });
  }

  release(): void {
    const next = this.queue.shift();
    if (next) {
      clearTimeout(next.timer);
      next.resolve(); // the slot passes on
    } else {
      this.inflight--;
    }
  }

  // Whether a call may go to the database now (one probe at a time when half open).
  allow(): boolean {
    if (this.state === "open" && Date.now() - this.openedAt >= this.config.breakerOpenMs) {
      this.change("half-open");
    }
    if (this.state === "closed") return true;
    if (this.state === "half-open" && !this.probing) {
      this.probing = true;
      return true;
    }
    return false;
  }

  success(ms: number): void {
    this.counts.ok++;
    if (this.latencies.push(ms) > 500) this.latencies.shift();
    this.probing = false;
    if (this.state !== "closed") {
      this.failures = [];
      this.change("closed");
    }
  }

  failure(outcome: Outcome, message: string): void {
    this.counts[outcome]++;
    this.lastError = message.slice(0, 300);
    this.probing = false;
    if (outcome === "client") return; // a 4xx says nothing about the database
    const now = Date.now();
    this.failures = [...this.failures.filter((t) => now - t <= this.config.breakerWindowMs), now];
    if (this.state === "half-open" || this.failures.length >= this.config.breakerFailures) {
      this.openedAt = now;
      if (this.state !== "open") {
        this.trips++;
        this.change("open");
      }
    }
  }

  change(state: Client["state"]): void {
    this.state = state;
    console.warn(
      `data client: circuit ${state} (in flight ${this.inflight}, queue ${this.queue.length}, last error: ${this.lastError || "-"})`,
    );
  }

  snapshot() {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const at = (q: number) =>
      sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]) : null;
    return {
      state: this.state,
      inflight: this.inflight,
      queue: this.queue.length,
      max_inflight: this.maxInflight,
      max_queue: this.maxQueue,
      trips: this.trips,
      counts: this.counts,
      latency_ms: { p50: at(0.5), p95: at(0.95), p99: at(0.99) },
      last_error: this.lastError,
      config: this.config,
    };
  }
}

const shared = globalThis as unknown as { __ajrDataClient?: Client };
export const client: Client = (shared.__ajrDataClient ??= new Client(CONFIG));

// What a failed answer of the Data API says about the database.
function classify(status: number, body: string): Outcome {
  if (status === 504) return "pool"; // PGRST003: no connection free in the pool
  if (body.includes('"57014"')) return "statement"; // statement timeout
  if (status >= 500) return "server";
  return "client";
}

// One call to the database under the limit, the breaker and the deadline: `run` makes
// the request with the signal that gives up after callDeadlineMs.
export async function call<T>(name: string, run: (signal: AbortSignal) => Promise<Response>): Promise<T> {
  if (!client.allow()) {
    client.counts.open++;
    throw new DataUnavailable("open", `api.${name}: the database is not answering, retry in a moment`);
  }
  await client.acquire();
  const start = performance.now();
  try {
    let response: Response;
    try {
      response = await run(AbortSignal.timeout(client.config.callDeadlineMs));
    } catch (error) {
      const outcome: Outcome = (error as Error).name === "TimeoutError" ? "timeout" : "network";
      client.failure(outcome, `api.${name}: ${error}`);
      throw new DataUnavailable(outcome, `api.${name}: ${outcome} after ${Math.round(performance.now() - start)} ms`);
    }
    if (response.ok) {
      const text = await response.text(); // empty for a function returning nothing
      const value = (text ? JSON.parse(text) : undefined) as T;
      client.success(performance.now() - start);
      return value;
    }
    const body = await response.text();
    const outcome = classify(response.status, body);
    client.failure(outcome, `api.${name}: HTTP ${response.status} ${body}`);
    throw new DataUnavailable(outcome, `api.${name}: HTTP ${response.status} ${body}`);
  } finally {
    client.release();
  }
}

// For proxy.ts: whether requests that need not wait (crawlers) should be told to come
// back later — early, not only once the breaker opens: a crawler's page whose render
// fails is sent as a 500 that never ends (Next streams pages to most crawlers whole,
// htmlLimitedBots), so a crawler should not start one while calls are failing or
// queueing. A failure within the breaker's window, or a quarter-full queue: yes.
export function overloaded(): boolean {
  const now = Date.now();
  const failing = client.failures.some((t) => now - t <= client.config.breakerWindowMs);
  return client.state !== "closed" || failing || client.queue.length >= client.config.queueMax / 4;
}
