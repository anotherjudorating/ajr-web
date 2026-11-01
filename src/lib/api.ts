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
  entry: "new" | "returning" | null; // not in the table 90 days ago: first time in this weight or back
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
  weights: string[]; // fought in, the latest first
  peak_score: number | null;
  peak_on: string | null;
  peak_place: number | null; // the place in that day's table
  score_change_90d: number | null;
  score_change_6m: number | null;
  places_up_90d: number | null;
  places_up_6m: number | null;
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
  rd_before: number;
  score_before: number;
  score_after: number;
  opponent_score: number | null; // before the contest
  // how the athlete ended the competition: gold, silver, bronze, 5th, 7th, the round
  // they lost in ("Round of 16"), or null (still in, pools, unknown)
  result: string | null;
};

export type P4PRow = {
  place: number;
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  weight: string;
  weight_place: number;
  rating: number;
  rd: number;
  score: number;
  gap: number; // score minus the average of the 7 best others of the weight
  trend: (number | null)[];
};

export type TeamRow = {
  place: number;
  country: string | null;
  country_name: string | null;
  rating: number; // average score of the nation's best athlete in every weight
  weights_led: number; // weights where its best athlete is the best of all nations
  weights_top8: number;
  weights_filled: number;
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

// Pound for pound: the top 3 of every weight of a gender ("men" / "women").
export async function p4p(gender: string, day?: string): Promise<P4PRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<P4PRow[]>("p4p", day ? { gender, day } : { gender });
}

// Nations, kind "men" / "women" / "mixed".
export async function teams(kind: string, day?: string): Promise<TeamRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<TeamRow[]>("teams", day ? { kind, day } : { kind });
}

// One row of an all-time record (api.records / api.record). Records of nations and
// tournaments have no athlete; what `value` and `detail` hold depends on the record.
export type RecordRow = {
  record: string;
  place: number;
  athlete_id: number | null;
  family_name: string | null;
  given_name: string | null;
  gender: "male" | "female" | null;
  opponent_id: number | null;
  opponent_family_name: string | null;
  opponent_given_name: string | null;
  country: string | null;
  country_name: string | null;
  competition_id: number | null;
  competition: string | null;
  weight: string | null;
  value: number;
  detail: Record<string, number | string> | null;
  day: string | null;
};

// The first `top` rows of every record, for men or women only when `gender` is set
// (records of nations and tournaments stay as they are).
export async function records(top: number, gender?: "male" | "female"): Promise<RecordRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<RecordRow[]>("records", gender ? { top, for_gender: gender } : { top });
}

// All rows of one record (up to 500).
export async function record(name: string, gender?: "male" | "female", weight?: string): Promise<RecordRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<RecordRow[]>("record", {
    name,
    ...(gender && { for_gender: gender }),
    ...(weight && { only_weight: weight }),
  });
}

export type PopularMatchupRow = {
  a: number;
  a_family_name: string | null;
  a_given_name: string | null;
  a_country: string | null;
  a_score: number | null;
  b: number;
  b_family_name: string | null;
  b_given_name: string | null;
  b_country: string | null;
  b_score: number | null;
  weight: string | null;
  wins: number; // of a against b
  losses: number;
  last_meeting: string | null;
};

// The head-to-head pairs opened most, or `fallback` ([a1, b1, a2, b2, …]) while few were.
export async function popularMatchupRows(fallback: number[]): Promise<PopularMatchupRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<PopularMatchupRow[]>("popular_matchups", { fallback: `{${fallback.join(",")}}` });
}

export type ContestDetail = {
  contest_id: number;
  competition_id: number;
  competition: string;
  competition_rank: string | null;
  city: string | null;
  day: string;
  weight: string | null; // the contest's category ("-73", "Open")
  round: string | null;
  duration: string | null; // "00:02:41"
  golden_score: boolean | null;
  winner_id: number | null;
  white_id: number | null;
  white_family_name: string | null;
  white_given_name: string | null;
  white_country: string | null;
  white_place_before: number | null; // in the weight's table the day before
  white_ippon: number | null;
  white_waza: number | null;
  white_yuko: number | null;
  white_shido: number | null;
  white_win_probability: number | null; // null: not rated (a bye, not fought yet)
  white_rating_before: number | null;
  white_rating_after: number | null;
  white_rd_before: number | null;
  white_rd_after: number | null;
  white_score_before: number | null;
  white_score_after: number | null;
  blue_id: number | null;
  blue_family_name: string | null;
  blue_given_name: string | null;
  blue_country: string | null;
  blue_place_before: number | null; // in the weight's table the day before
  blue_ippon: number | null;
  blue_waza: number | null;
  blue_yuko: number | null;
  blue_shido: number | null;
  blue_win_probability: number | null; // null: not rated (a bye, not fought yet)
  blue_rating_before: number | null;
  blue_rating_after: number | null;
  blue_rd_before: number | null;
  blue_rd_after: number | null;
  blue_score_before: number | null;
  blue_score_after: number | null;
};

export async function contest(id: number): Promise<ContestDetail | null> {
  "use cache";
  cacheLife("data");
  const rows = await rpc<ContestDetail[]>("contest", { contest_id: id });
  return rows[0] ?? null;
}

export type CompetitionRow = {
  id: number;
  name: string;
  rank_name: string | null;
  city: string | null;
  country: string | null;
  country_name: string | null;
  date_from: string;
  date_to: string | null;
  contests: number;
  accuracy: number | null; // share of real fights the rating's favourite won
  upsets: number;
};

// Tournaments of a year (all with null), latest first.
export async function competitions(year: number | null): Promise<CompetitionRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<CompetitionRow[]>("competitions", year ? { for_year: year } : {});
}

export type ContestListRow = {
  total: number; // all that match the filters
  contest_id: number;
  competition_id: number;
  competition: string;
  day: string;
  weight: string | null;
  round: string | null;
  winner_id: number;
  white_id: number;
  white_family_name: string | null;
  white_given_name: string | null;
  white_country: string | null;
  white_chance: number;
  white_change: number;
  blue_id: number;
  blue_family_name: string | null;
  blue_given_name: string | null;
  blue_country: string | null;
  blue_chance: number;
  blue_change: number;
};

export type ContestFilters = {
  year: number;
  weight?: string;
  competition?: number;
  upsets?: boolean;
  q?: string;
  sort?: string;
  top: number;
  skip: number;
};

// A page of a year's decided contests.
export async function contestsPage(f: ContestFilters): Promise<ContestListRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<ContestListRow[]>("contests", {
    for_year: f.year,
    top: f.top,
    skip: f.skip,
    ...(f.weight && { only_weight: f.weight }),
    ...(f.competition && { competition_id: f.competition }),
    ...(f.upsets && { upsets: "true" }),
    ...(f.q && { q: f.q }),
    ...(f.sort && { sort: f.sort }),
  });
}

export type AthleteListRow = {
  total: number;
  id: number;
  family_name: string | null;
  given_name: string | null;
  gender: string | null;
  country: string | null;
  birth_year: number | null;
  weight: string | null;
  place: number | null; // today; null when not in a table
  score: number | null;
  contests: number;
  last_contest: string;
  last_competition_id: number | null;
  last_competition: string | null;
};

export type AthleteFilters = {
  q?: string;
  country?: string;
  gender?: string;
  weight?: string;
  sort?: string;
  top: number;
  skip: number;
};

// A page of rated athletes.
export async function athletesPage(f: AthleteFilters): Promise<AthleteListRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<AthleteListRow[]>("athletes", {
    top: f.top,
    skip: f.skip,
    ...(f.q && { q: f.q }),
    ...(f.country && { country: f.country }),
    ...(f.gender && { gender: f.gender }),
    ...(f.weight && { only_weight: f.weight }),
    ...(f.sort && { sort: f.sort }),
  });
}

export type NationRow = { country: string; name: string; athletes: number; active: number };

export async function nations(): Promise<NationRow[]> {
  "use cache";
  cacheLife("data");
  return rpc<NationRow[]>("nations");
}
