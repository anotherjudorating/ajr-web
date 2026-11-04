// Calls from the browser, all through the site's own /api routes: reads (a row
// expanded) are served from the server's cache (lib/api.ts), so the same question
// asked by many reaches the database once in a while; the head-to-head count goes
// through the site too. The browser never talks to the database. The searches search
// an index in the browser (lib/search-index.ts).

import type { HistoryRow } from "@/lib/api";

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

// One more opening of a head-to-head pair (orders the popular matchups). Fire and
// forget: a failed count changes nothing on the page.
export function countMatchup(a: number, b: number): void {
  fetch("/api/matchup-view", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, b }),
  }).catch(() => {});
}
