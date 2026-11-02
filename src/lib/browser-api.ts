// Reads from the browser (e.g. when a row is expanded): the same Data API, without
// the server cache. Only public data with the publishable key.

import type { HistoryRow, LeaderboardRow } from "@/lib/api";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

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

async function load(athleteId: number): Promise<HistoryRow[]> {
  const response = await fetch(`${URL}/rest/v1/rpc/athlete_history?athlete_id=${athleteId}`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) throw new Error(`athlete_history: HTTP ${response.status}`);
  return response.json();
}

// Today's table of a weight, for the head-to-head picker; kept while the page is open.
const leaderboards = new Map<string, Promise<LeaderboardRow[]>>();

export function fetchLeaderboard(weight: string): Promise<LeaderboardRow[]> {
  let request = leaderboards.get(weight);
  if (!request) {
    request = fetch(`${URL}/rest/v1/rpc/leaderboard?weight=${encodeURIComponent(weight)}`, {
      headers: { apikey: KEY },
    }).then((response) => {
      if (!response.ok) throw new Error(`leaderboard: HTTP ${response.status}`);
      return response.json();
    });
    request.catch(() => leaderboards.delete(weight)); // try again next time
    leaderboards.set(weight, request);
  }
  return request;
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

export type SearchHit = {
  kind: "athlete" | "tournament" | "nation";
  id: number | null;
  name: string | null;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  gender: string | null;
  weight: string | null;
  date_from: string | null;
  date_to: string | null;
};

// The header's search: up to 5 athletes, 3 tournaments and 3 nations.
export async function searchSite(q: string, signal?: AbortSignal): Promise<SearchHit[]> {
  const response = await fetch(`${URL}/rest/v1/rpc/search?q=${encodeURIComponent(q)}`, {
    headers: { apikey: KEY },
    signal,
  });
  if (!response.ok) throw new Error(`search: HTTP ${response.status}`);
  return response.json();
}
