// Reads from the browser (a row expanded, a search typed): through the site's own
// /api routes, which serve them from the server's cache (lib/api.ts), so the same
// question asked by many reaches the database once in a while. Only the head-to-head
// count, a write, goes to the Data API itself.

import type { AthleteHit, HistoryRow, SearchHit } from "@/lib/api";

export type { AthleteHit, SearchHit };

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

// Kept while the page is open: a row opened again shows its contests at once.
const histories = new Map<number, HistoryRow[]>();
const requests = new Map<number, Promise<HistoryRow[]>>();

export function cachedAthleteHistory(athleteId: number): HistoryRow[] | undefined {
  return histories.get(athleteId);
}

export function fetchAthleteHistory(athleteId: number): Promise<HistoryRow[]> {
  let request = requests.get(athleteId);
  if (!request) {
    request = load(athleteId).then(
      (rows) => {
        histories.set(athleteId, rows);
        return rows;
      },
      (error) => {
        requests.delete(athleteId); // try again next time
        throw error;
      },
    );
    requests.set(athleteId, request);
  }
  return request;
}

function load(athleteId: number): Promise<HistoryRow[]> {
  return get(`/api/athlete-history?id=${athleteId}`);
}

// The head-to-head's athlete boxes: every rated athlete, the weight's table first.
export function searchAthletes(q: string, weight: string | null, signal?: AbortSignal): Promise<AthleteHit[]> {
  const query = new URLSearchParams({ q, ...(weight && { weight }) });
  return get(`/api/search-athletes?${query}`, signal);
}

// One more opening of a head-to-head pair (orders the popular matchups). Fire and
// forget: a failed count changes nothing on the page.
export function countMatchup(a: number, b: number): void {
  fetch(`${URL}/rest/v1/rpc/count_matchup`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ a, b }),
  }).catch(() => {});
}

// The header's search: up to 5 athletes, 3 tournaments and 3 nations.
export function searchSite(q: string, signal?: AbortSignal): Promise<SearchHit[]> {
  return get(`/api/search?q=${encodeURIComponent(q)}`, signal);
}
