// A limit on the pages one IP may load (a token bucket per IP, in this process: the
// site runs as one instance). A person loads a page's HTML once and then moves around
// with Next's navigation (RSC requests, not counted), a few pages a minute at most; the
// scraper of November 2026 passed Cloudflare's challenge and fetched ~10 pages a second
// from each of a few dozen IPs. Cloudflare's free rate limit rule cannot tell a page
// from Next's prefetches (no headers, no query in it): hence here.

const BURST = 20; // pages at once (opening a few tabs, reloading)
const PER_SECOND = 0.5; // then one page every 2 seconds
const IDLE_MS = 60_000; // a bucket untouched this long is full again: dropped
const SWEEP_MS = 30_000;

type Bucket = { tokens: number; at: number };
// `seen`: the page requests the proxy saw, by kind (visitor or crawler, asking for HTML
// or not, which address headers came: their names only, never an address), to tell
// from /api/health why the limit stays idle.
type Seen = Record<string, number>;
const state = globalThis as unknown as {
  pageLimit?: {
    buckets: Map<string, Bucket>;
    swept: number;
    refused: number;
    seen: Seen;
  };
};
const limit = (state.pageLimit ??= {
  buckets: new Map(),
  swept: 0,
  refused: 0,
  seen: {} as Seen,
});

export function noteRequest(kind: string) {
  limit.seen[kind] = (limit.seen[kind] ?? 0) + 1;
}

/** For /api/health: the pages refused since the start, the IPs being followed. */
export const pageLimitStats = () => ({
  refused: limit.refused,
  ips: limit.buckets.size,
  seen: limit.seen,
});

/** Whether this IP may load one more page now; if not, the seconds until it may. */
export function takePage(
  ip: string,
  now = Date.now(),
): { ok: true } | { ok: false; retryAfter: number } {
  if (now - limit.swept > SWEEP_MS) {
    for (const [key, bucket] of limit.buckets)
      if (now - bucket.at > IDLE_MS) limit.buckets.delete(key);
    limit.swept = now;
  }
  const bucket = limit.buckets.get(ip) ?? { tokens: BURST, at: now };
  bucket.tokens = Math.min(
    BURST,
    bucket.tokens + ((now - bucket.at) / 1000) * PER_SECOND,
  );
  bucket.at = now;
  limit.buckets.set(ip, bucket);
  if (bucket.tokens < 1) {
    limit.refused++;
    return {
      ok: false,
      retryAfter: Math.ceil((1 - bucket.tokens) / PER_SECOND),
    };
  }
  bucket.tokens -= 1;
  return { ok: true };
}
