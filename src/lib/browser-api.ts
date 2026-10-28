// Reads from the browser (e.g. when a row is expanded): the same Data API, without
// the server cache. Only public data with the publishable key.

import type { HistoryRow } from "@/lib/api";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export async function fetchAthleteHistory(athleteId: number): Promise<HistoryRow[]> {
  const response = await fetch(`${URL}/rest/v1/rpc/athlete_history?athlete_id=${athleteId}`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) throw new Error(`athlete_history: HTTP ${response.status}`);
  return response.json();
}
