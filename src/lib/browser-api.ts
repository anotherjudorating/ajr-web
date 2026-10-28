// Reads from the browser (e.g. when a row is expanded): the same Data API, without
// the server cache. Only public data with the publishable key.

import type { HistoryRow } from "@/lib/api";

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
