// Reads the backend's `api` schema through the Supabase Data API (PostgREST).
// Every function is cached for the "data" profile (see next.config.ts): the
// backend job refreshes the database every 15 minutes.

import { cacheLife } from "next/cache";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type LeaderboardRow = {
  place: number;
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null; // IOC code
  rating: number;
  rd: number;
  score: number;
  last_contest: string; // YYYY-MM-DD
  places_up_90d: number | null; // null: not in the table 90 days ago
  score_change_90d: number | null;
  score_change_6m: number | null;
  wrl_place: number | null; // IJF World Ranking List, today's table only
  places_up_6m: number | null;
  birth_year: number | null;
  trend: (number | null)[]; // score 150, 120, 90, 60, 30 days before and on the day
  last_competition_id: number | null;
  last_competition_name: string | null;
  last_competition_rank: string | null; // "Grand Slam", "World Championships"…
  last_competition_city: string | null;
};

export type Athlete = {
  id: number;
  family_name: string | null;
  given_name: string | null;
  gender: string | null;
  birth_year: number | null;
  country: string | null;
  country_name: string | null;
  weight: string | null;
  rating: number | null;
  rd: number | null;
  score: number | null;
  place: number | null; // null: hidden (a year without contests) or never rated
  last_contest: string | null;
  contests: number;
  wrl_place: number | null;
};

export type HistoryRow = {
  contest_id: number;
  fought_on: string;
  competition_id: number;
  competition: string;
  round: string | null;
  weight: string | null;
  opponent_id: number;
  opponent_family_name: string | null;
  opponent_given_name: string | null;
  opponent_country: string | null;
  won: boolean;
  win_probability: number;
  rating_before: number;
  rating_after: number;
  rd_after: number;
};

async function rpc<T>(name: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!URL || !KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set");
  }
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const response = await fetch(`${URL}/rest/v1/rpc/${name}?${query}`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) {
    throw new Error(`api.${name}: HTTP ${response.status} ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

// The whole table of a weight category (a few hundred rows), today's or on `day`.
export async function leaderboard(weight: string, day?: string): Promise<LeaderboardRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<LeaderboardRow[]>("leaderboard", day ? { weight, day } : { weight });
}

export async function athlete(id: number): Promise<Athlete | null> {
  "use cache";
  cacheLife("data");
  const rows = await rpc<Athlete[]>("athlete", { athlete_id: id });
  return rows[0] ?? null;
}

export async function athleteHistory(id: number): Promise<HistoryRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<HistoryRow[]>("athlete_history", { athlete_id: id });
}

export async function lastUpdate(): Promise<string | null> {
  "use cache";
  cacheLife("data");
  return rpc<string | null>("last_update");
}
