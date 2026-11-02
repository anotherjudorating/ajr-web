// Load test of the whole site: visitors walking its pages, as people do, against
// the deployment (Vercel's cache, the server, the database behind it).
//
//   node scripts/siteload.mjs [--site https://www.anotherjudorating.com] [--steps 25,50,100,200] [--seconds 45]
//                             [--skip search,explore]   (kinds of visits left out)
//
// Each "client" asks for the next page as soon as one arrives: no pause to read, so
// N clients are many more people than N (one page every 10-30 s each). The pages
// are picked from the data (Supabase, read only): the popular ones most often, the
// long tail (any athlete, any tournament) often enough to miss every cache.

const arg = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`);
  return at > 0 ? process.argv[at + 1] : fallback;
};
const SITE = arg("site", "https://www.anotherjudorating.com").replace(/\/$/, "");
const STEPS = arg("steps", "25,50,100,200").split(",").map(Number);
const SECONDS = Number(arg("seconds", 45));
const SKIP = arg("skip", "").split(",").filter(Boolean);
const API = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc`;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const TIMEOUT = 30_000;

const WEIGHTS = ["men-60", "men-66", "men-73", "men-81", "men-90", "men-100", "men-plus-100",
  "women-48", "women-52", "women-57", "women-63", "women-70", "women-78", "women-plus-78"];
const API_WEIGHTS = ["-60", "-66", "-73", "-81", "-90", "-100", "+100", "-48", "-52", "-57", "-63", "-70", "-78", "+78"];

async function rpc(name, params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API}/${name}?${query}`, { headers: { apikey: KEY } });
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  return response.json();
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];

// What there is to visit, by kind; the share of visits each kind gets.
async function pages() {
  const tables = await Promise.all(API_WEIGHTS.map((w) => rpc("leaderboard", { weight: w })));
  const top = tables.flatMap((t) => t.slice(0, 30).map((r) => r.athlete_id));
  const tail = [];
  for (const skip of [2000, 8000, 15000, 21000]) {
    tail.push(...(await rpc("athletes", { top: 200, skip })).map((r) => r.id));
  }
  const year = new Date().getFullYear();
  const competitions = [...(await rpc("competitions", { for_year: year })), ...(await rpc("competitions", { for_year: year - 1 }))];
  const recent = competitions.slice(0, 10).map((c) => c.id);
  const older = competitions.slice(10).map((c) => c.id);
  const old = (await rpc("competitions", { for_year: 2014 })).map((c) => c.id);
  const nations = (await rpc("nations")).map((n) => n.country.toLowerCase());
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return [
    { kind: "popular", share: 40, url: () => pick([
      "/", "/rankings/teams/mixed", "/rankings/teams/men", "/rankings/p4p/men", "/rankings/p4p/women",
      ...WEIGHTS.map((w) => `/rankings/${w}`), "/records", "/explore/tournaments", "/head-to-head"]) },
    { kind: "athlete, top", share: 20, url: () => `/athletes/${pick(top)}` },
    { kind: "athlete, any", share: 10, url: () => `/athletes/${pick(tail)}` },
    { kind: "tournament", share: 7, url: () => `/tournaments/${pick(Math.random() < 0.6 ? recent : [...older, ...old])}` },
    { kind: "tournament weight", share: 3, url: () => `/tournaments/${pick(recent)}/${pick(WEIGHTS)}` },
    { kind: "search", share: 10, url: () => `/api/search?q=${Math.random() < 0.5
      ? pick(["abe", "kim", "tan", "heyd", "jap", "fra", "tokyo", "paris"])
      : pick(letters) + pick(letters) + pick(letters)}` },
    { kind: "nation", share: 5, url: () => `/countries/${Math.random() < 0.6 ? pick(nations.slice(0, 20)) : pick(nations)}` },
    { kind: "explore", share: 5, url: () => pick([
      `/explore/contests?year=${year}`, `/explore/contests?year=${year}&result=upsets&sort=chance-asc`,
      `/explore/athletes?country=${pick(["JPN", "FRA", "GEO", "BRA"])}`, `/explore/athletes?sort=rating-desc`,
      "/explore/nations", `/explore/tournaments?year=${pick([year, 2018, 2012])}`]) },
  ];
}

function choose(kinds) {
  let roll = Math.random() * 100;
  for (const kind of kinds) if ((roll -= kind.share) < 0) return kind;
  return kinds[0];
}

const percentile = (values, share) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(share * sorted.length))]) : 0;
};

async function step(kinds, clients) {
  const until = Date.now() + SECONDS * 1000;
  const results = [];
  const client = async () => {
    while (Date.now() < until) {
      const kind = choose(kinds);
      const url = kind.url();
      const start = Date.now();
      let status = 0;
      let cache = "";
      try {
        const response = await fetch(SITE + url, { signal: AbortSignal.timeout(TIMEOUT), redirect: "manual" });
        await response.arrayBuffer();
        status = response.status;
        cache = response.headers.get("x-vercel-cache") ?? "";
      } catch (error) {
        status = error.name === "TimeoutError" ? -1 : 0;
      }
      results.push({ kind: kind.kind, url, status, cache, ms: Date.now() - start });
    }
  };
  await Promise.all(Array.from({ length: clients }, client));
  return results;
}

function report(clients, results) {
  const bad = (r) => r.status < 200 || r.status >= 400;
  const line = (label, rows) => {
    const ms = rows.map((r) => r.ms);
    const failed = rows.filter(bad).length;
    const hits = rows.filter((r) => r.cache === "HIT" || r.cache === "STALE").length;
    return `${label.padEnd(18)} ${String(rows.length).padStart(6)} req  p50 ${String(percentile(ms, 0.5)).padStart(5)}  p95 ${String(percentile(ms, 0.95)).padStart(5)}  p99 ${String(percentile(ms, 0.99)).padStart(5)} ms  cache ${String(Math.round((hits * 100) / rows.length)).padStart(3)}%  failed ${failed}`;
  };
  console.log(`\n=== ${clients} clients, ${SECONDS}s: ${(results.length / SECONDS).toFixed(1)} req/s`);
  console.log(line("all", results));
  for (const kind of [...new Set(results.map((r) => r.kind))]) {
    console.log(line(kind, results.filter((r) => r.kind === kind)));
  }
  const failures = results.filter(bad);
  const examples = [...new Map(failures.map((r) => [`${r.status} ${r.kind}`, r])).values()].slice(0, 8);
  for (const r of examples) console.log(`  failed: ${r.status} ${r.url} (${r.ms} ms)`);
}

const kinds = (await pages()).filter((kind) => !SKIP.some((skip) => kind.kind.startsWith(skip)));
console.log(`${SITE}: steps ${STEPS.join(", ")} clients, ${SECONDS}s each${SKIP.length ? `, without ${SKIP}` : ""}`);
for (const clients of STEPS) report(clients, await step(kinds, clients));
