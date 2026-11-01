// Stress test of everything the site reads: every api function with the arguments
// the pages use, then (with --site) every page. First one request at a time (a cold
// database looks like this), then in waves of 5, 15 and 30 at once, as Next.js does
// when it builds or refreshes its cache.
//
//   node scripts/stress.mjs                             # the Data API only
//   node scripts/stress.mjs --site http://localhost:3000 # and the pages
//   node scripts/stress.mjs --waves 1,5                  # other concurrencies
//
// Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY from the
// environment or .env.local. Exits with 1 when any request failed.

import { readFileSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith("--") ? [...pairs, [arg.slice(2), all[i + 1]]] : pairs), []),
);
const env = { ...readEnv(".env.local"), ...process.env };
const API = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const SITE = args.site;
const WAVES = (args.waves ?? "1,5,15,30").split(",").map(Number);
if (!API || !KEY) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set");

const WEIGHTS = [
  ["men-60", "-60"], ["men-66", "-66"], ["men-73", "-73"], ["men-81", "-81"], ["men-90", "-90"],
  ["men-100", "-100"], ["men-plus-100", "+100"], ["women-48", "-48"], ["women-52", "-52"],
  ["women-57", "-57"], ["women-63", "-63"], ["women-70", "-70"], ["women-78", "-78"], ["women-plus-78", "+78"],
]; // prettier-ignore
const PAST = ["2024-03-01", "2019-06-01", "2012-01-01"];
const RECORDS = [
  "highest_rating", "biggest_lead", "longest_at_1", "youngest_1", "biggest_tournament_gain",
  "most_world_tour_medals", "most_medals_in_row", "youngest_grand_slam_medal",
  "longest_winning_streak", "biggest_upsets", "giant_killer", "most_frequent_rivalry",
  "strongest_tournament", "most_nations_on_podium", "most_unpredictable_tournament",
  "most_predictable_tournament", "highest_team_rating", "longest_at_1_nation",
  "most_medals_nation", "most_medals_one_tournament",
]; // prettier-ignore
const RECORD_SLUGS = [
  "highest-rating", "biggest-lead-at-1", "longest-at-1", "youngest-1", "biggest-gain-at-one-tournament",
  "most-world-tour-medals", "most-medals-in-a-row", "youngest-grand-slam-medal", "longest-winning-streak",
  "biggest-upsets", "giant-killer", "most-frequent-rivalry", "strongest-tournament",
  "most-nations-on-the-podium", "most-unpredictable-tournament", "most-predictable-tournament",
  "highest-team-rating", "longest-at-1-nation", "most-medals", "most-medals-at-one-tournament",
]; // prettier-ignore

// --- the cases -----------------------------------------------------------------

const rpc = (group, name, params = {}) => ({
  group,
  label: `${name}(${Object.values(params).join(", ")})`,
  url: `${API}/rest/v1/rpc/${name}?${new URLSearchParams(params)}`,
  headers: { apikey: KEY },
});
const page = (group, path) => ({ group, label: path, url: `${SITE}${path}`, page: true });

async function apiCases() {
  const cases = [rpc("last_update", "last_update")];
  for (const [, weight] of WEIGHTS) {
    cases.push(rpc("leaderboard today", "leaderboard", { weight }));
    for (const day of PAST) cases.push(rpc("leaderboard past", "leaderboard", { weight, day }));
  }
  for (const gender of ["men", "women"]) {
    cases.push(rpc("p4p today", "p4p", { gender }));
    for (const day of PAST) cases.push(rpc("p4p past", "p4p", { gender, day }));
  }
  for (const kind of ["mixed", "men", "women"]) {
    cases.push(rpc("teams today", "teams", { kind }));
    for (const day of PAST) cases.push(rpc("teams past", "teams", { kind, day }));
  }
  for (const gender of [null, "male", "female"]) {
    cases.push(rpc("records", "records", gender ? { top: 10, for_gender: gender } : { top: 10 }));
  }
  for (const name of RECORDS) {
    cases.push(rpc("record", "record", { name }));
    for (const gender of ["male", "female"]) cases.push(rpc("record", "record", { name, for_gender: gender }));
  }
  for (const [, weight] of WEIGHTS) cases.push(rpc("record", "record", { name: "highest_rating", only_weight: weight }));
  for (const [id, weight] of await topAthletes()) {
    cases.push(rpc("athlete", "athlete", { athlete_id: id }));
    cases.push(rpc("athlete_history", "athlete_history", { athlete_id: id }));
    cases.push(rpc("athlete_history", "athlete_history", { athlete_id: id, only_weight: weight }));
  }
  return cases;
}

async function pageCases() {
  const cases = [];
  for (const [slug] of WEIGHTS) {
    cases.push(page("page: weight", `/rankings/${slug}`));
    cases.push(page("page: weight past", `/rankings/${slug}?date=${PAST[0]}`));
  }
  for (const gender of ["men", "women"]) cases.push(page("page: p4p", `/rankings/p4p/${gender}`));
  for (const kind of ["mixed", "men", "women"]) cases.push(page("page: teams", `/rankings/teams/${kind}`));
  cases.push(page("page: records", "/records"));
  for (const slug of RECORD_SLUGS) cases.push(page("page: record", `/records/${slug}`));
  for (const [id] of (await topAthletes()).slice(0, 28)) cases.push(page("page: athlete", `/athletes/${id}`));
  for (const path of ["/", "/methodology", "/explore", "/head-to-head"]) cases.push(page("page: other", path));
  return cases;
}

// The top 5 of every weight today: real athletes for the athlete pages.
let athletes;
async function topAthletes() {
  if (!athletes) {
    athletes = [];
    for (const [, weight] of WEIGHTS) {
      const rows = await (await fetch(rpc("", "leaderboard", { weight }).url, { headers: { apikey: KEY } })).json();
      for (const row of rows.slice(0, 5)) athletes.push([row.athlete_id, weight]);
    }
  }
  return athletes;
}

// --- running -------------------------------------------------------------------

async function run(test) {
  const start = performance.now();
  try {
    const response = await fetch(test.url, { headers: test.headers });
    const body = await response.text();
    // a page that rendered an error still answers 200 when it streamed
    const broken = test.page && /Runtime Error|Application error|statement timeout/.test(body);
    const ok = response.ok && !broken;
    return { ...test, ok, ms: performance.now() - start, error: ok ? null : `${response.status} ${body.slice(0, 120)}` };
  } catch (error) {
    return { ...test, ok: false, ms: performance.now() - start, error: String(error) };
  }
}

async function wave(cases, concurrency) {
  const queue = [...cases].sort(() => Math.random() - 0.5);
  const results = [];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) results.push(await run(queue.shift()));
  });
  const start = performance.now();
  await Promise.all(workers);
  return { results, seconds: (performance.now() - start) / 1000 };
}

function report(title, { results, seconds }) {
  const groups = Map.groupBy(results, (r) => r.group);
  console.log(`\n${title}: ${results.length} requests in ${seconds.toFixed(1)} s`);
  console.log("  group                 n  errors    p50    p95    max  (ms)");
  for (const [group, rows] of groups) {
    const ms = rows.map((r) => r.ms).sort((a, b) => a - b);
    const at = (q) => Math.round(ms[Math.min(ms.length - 1, Math.floor(q * ms.length))]);
    const errors = rows.filter((r) => !r.ok).length;
    console.log(
      `  ${group.padEnd(20)} ${String(rows.length).padStart(3)} ${String(errors).padStart(7)} ${String(at(0.5)).padStart(6)} ${String(at(0.95)).padStart(6)} ${String(at(1)).padStart(6)}`,
    );
  }
  for (const failed of results.filter((r) => !r.ok).slice(0, 10)) {
    console.log(`  ✗ ${failed.label}: ${failed.error}`);
  }
  return results.filter((r) => !r.ok).length;
}

function readEnv(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split("\n")
        .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/))
        .filter(Boolean)
        .map((m) => [m[1], m[2]]),
    );
  } catch {
    return {};
  }
}

const cases = [...(await apiCases()), ...(SITE ? await pageCases() : [])];
let failures = 0;
for (const concurrency of WAVES) {
  failures += report(`${concurrency} at a time`, await wave(cases, concurrency));
}
console.log(failures ? `\n${failures} failed` : "\nall passed");
process.exit(failures ? 1 : 0);
