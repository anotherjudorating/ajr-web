// Past weeks' tables as files in Cloudflare R2 (ajr-backend ajr/tables,
// docs/audits/2026-11-08-r2-tables-plan.md): one table a week, on Monday (a table barely
// moves between tournaments, and they end at weekends); a past week never changes
// unless the rating does, so the update job computes it once and the site reads the
// file instead of asking the database. A day's table is its week's Monday's. Each file
// is exactly what api.leaderboard / api.p4p / api.teams answer for that Monday. The
// manifest says the version (a hash of the rating settings), the Mondays covered and the
// generations (a week computed again gets a new file name, as files are cached a year
// at the edge).
//
// Anything missing — AJR_DATA_URL unset, the manifest or a file not there, R2 switched
// off by its kill switch, a network error — returns null, and lib/api.ts asks the
// database as before. So unsetting AJR_DATA_URL is the way back.

import { cacheLife } from "next/cache";

const DATA_URL = process.env.AJR_DATA_URL; // https://data.anotherjudorating.com
const TIMEOUT_MS = 5000;

type Manifest = {
  version: string;
  first_day: string;
  last_day: string;
  generations?: { from: string; g: number }[];
};

async function get<T>(path: string): Promise<T | null> {
  if (!DATA_URL) return null;
  try {
    const response = await fetch(`${DATA_URL}/${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) {
      if (response.status !== 404) console.warn(`tables: ${path}: HTTP ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`tables: ${path}: ${error}`);
    return null;
  }
}

// The manifest changes when a day is added or computed again: a few minutes in cache.
async function manifest(): Promise<Manifest | null> {
  "use cache: remote";
  cacheLife("manifest");
  return get<Manifest>("manifest.json");
}

// A file never changes (its name has the version and the generation).
async function file<T>(path: string): Promise<{ rows: T[] } | null> {
  "use cache: remote";
  cacheLife("tables");
  return get<{ rows: T[] }>(path);
}

// The Monday of a day's week, YYYY-MM-DD (the day itself on a Monday).
function monday(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

function generation(m: Manifest, day: string): number {
  return Math.max(0, ...(m.generations ?? []).filter((g) => g.from <= day).map((g) => g.g));
}

// The rows of a past day's table from R2, or null (then the database answers).
// table: "rankings" (name: the weight's slug), "p4p" (men, women), "teams" (men, women, mixed).
export async function pastTable<T>(table: "rankings" | "p4p" | "teams", name: string, day: string): Promise<T[] | null> {
  if (!DATA_URL) return null;
  const m = await manifest();
  const week = monday(day);
  if (!m || week < m.first_day || week > m.last_day) return null; // this week's: the database
  const g = generation(m, week);
  const doc = await file<T>(`v/${m.version}/${table}/${name}/${week.slice(0, 4)}/${week}${g ? `.g${g}` : ""}.json`);
  return doc?.rows ?? null;
}
