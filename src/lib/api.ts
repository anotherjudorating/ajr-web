// Reads the backend's `api` schema through the Supabase Data API (PostgREST).
// Every function is cached until the data changes (dataCache below). "use cache:
// remote": one cache for all the server's instances (on Vercel its Runtime Cache); a
// plain "use cache" lives in one instance's memory, which serverless keeps briefly,
// so under load each new instance went to the database again.

import { cacheLife, cacheTag } from "next/cache";

// Tagged "data" for the "data" profile (next.config.ts): the backend's update job
// calls /api/revalidate after a run that changed what the site shows, which marks
// everything tagged stale; until then a cached answer stays, however old.
export const DATA_TAG = "data";

function dataCache(): void {
  cacheLife("data");
  cacheTag(DATA_TAG);
}

// Server-side only (no NEXT_PUBLIC_: never in the browser's bundle): the browser asks
// the site, the site asks the database, so the Data API's key stays private.
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_KEY;

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

// A gateway error (the Data API restarting, a dropped connection) is tried once more
// after a pause. A statement timeout is not: the database is then saturated, and the
// same query again only adds to it.
const RETRIES = [1000 + Math.random() * 1000]; // ms, spread so retries do not arrive together
const TRANSIENT = (status: number) => status === 502 || status === 503 || status === 504;

async function rpc<T>(name: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!URL || !KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
  }
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(`${URL}/rest/v1/rpc/${name}?${query}`, {
      headers: { apikey: KEY },
    });
    if (response.ok) return response.json() as Promise<T>;
    const body = await response.text();
    if (attempt >= RETRIES.length || !TRANSIENT(response.status)) {
      throw new Error(`api.${name}: HTTP ${response.status} ${body}`);
    }
    await new Promise((resolve) => setTimeout(resolve, RETRIES[attempt]));
  }
}

// The whole table of a weight category (a few hundred rows), today's or on `day`.
export async function leaderboard(weight: string, day?: string): Promise<LeaderboardRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<LeaderboardRow[]>("leaderboard", day ? { weight, day } : { weight });
}

export async function athlete(id: number): Promise<Athlete | null> {
  "use cache: remote";
  dataCache();
  const rows = await rpc<Athlete[]>("athlete", { athlete_id: id });
  return rows[0] ?? null;
}

export async function athleteHistory(id: number): Promise<HistoryRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<HistoryRow[]>("athlete_history", { athlete_id: id });
}

// What the contest page shows of the two athletes' histories: each one's contests
// at the tournament (road) and the white athlete's against the blue one (meeting),
// rows as athleteHistory's. Far less than both whole histories.
export type ContextRow = HistoryRow & { side: "white" | "blue"; kind: "road" | "meeting" };

export async function contestContext(contestId: number): Promise<ContextRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<ContextRow[]>("contest_context", { contest_id: contestId });
}

// One more opening of a head-to-head pair (a write: never cached).
export async function countMatchup(a: number, b: number): Promise<void> {
  if (!URL || !KEY) throw new Error("SUPABASE_URL and SUPABASE_KEY must be set");
  const response = await fetch(`${URL}/rest/v1/rpc/count_matchup`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ a, b }),
  });
  if (!response.ok) throw new Error(`api.count_matchup: HTTP ${response.status} ${await response.text()}`);
}

export async function lastUpdate(): Promise<string | null> {
  "use cache: remote";
  dataCache();
  return rpc<string | null>("last_update");
}

// Pound for pound: the top 3 of every weight of a gender ("men" / "women").
export async function p4p(gender: string, day?: string): Promise<P4PRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<P4PRow[]>("p4p", day ? { gender, day } : { gender });
}

// Nations, kind "men" / "women" / "mixed".
export async function teams(kind: string, day?: string): Promise<TeamRow[]> {
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  dataCache();
  return rpc<RecordRow[]>("records", gender ? { top, for_gender: gender } : { top });
}

// All rows of one record (up to 500).
export async function record(name: string, gender?: "male" | "female", weight?: string): Promise<RecordRow[]> {
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  cacheLife("counts"); // the site's visitors count the pairs, not the backend job
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
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  dataCache();
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
  "use cache: remote";
  dataCache();
  return rpc<NationRow[]>("nations");
}

export type Competition = CompetitionRow & {
  weights: string[]; // fought at the tournament, in the site's order
};

export async function competition(id: number): Promise<Competition | null> {
  "use cache: remote";
  dataCache();
  const rows = await rpc<Competition[]>("competition", { competition_id: id });
  return rows[0] ?? null;
}

export type CompetitionResult = {
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  gender: string | null;
  country: string | null;
  weight: string;
  // gold, silver, bronze, 5th, 7th, the round lost in, or null (pools, no single final)
  result: string | null;
  score_before: number; // before the first contest of the tournament
  score_after: number; // after the last
  contests: number;
  wins: number;
  contests_before: number; // rated contests before this tournament (0: a debut)
};

// Every athlete of every weight, medallists first.
export async function competitionResults(id: number): Promise<CompetitionResult[]> {
  "use cache: remote";
  dataCache();
  return rpc<CompetitionResult[]>("competition_results", { competition_id: id });
}

export type CompetitionContest = {
  contest_id: number;
  weight: string;
  round: string | null;
  winner_id: number;
  white_id: number;
  white_family_name: string | null;
  white_given_name: string | null;
  white_country: string | null;
  white_chance: number;
  white_score_before: number;
  white_score_after: number;
  blue_id: number;
  blue_family_name: string | null;
  blue_given_name: string | null;
  blue_country: string | null;
  blue_chance: number;
  blue_score_before: number;
  blue_score_after: number;
  real_fight: boolean; // not a bye, not a 0:00 walkover
};

// The decided contests of a tournament (or of one weight), from the final back.
export async function competitionContests(id: number, weight?: string): Promise<CompetitionContest[]> {
  "use cache: remote";
  dataCache();
  return rpc<CompetitionContest[]>("competition_contests", {
    competition_id: id,
    ...(weight && { only_weight: weight }),
  });
}

export type Country = {
  country: string;
  name: string;
  athletes: number; // rated ever
  place: number | null; // today, in the mixed nations ranking; null: not in it
  place_men: number | null;
  place_women: number | null;
  rating: number | null; // mixed: the average score of its best athlete in every weight
  place_90d: number | null; // the latest week 90 days back
  rating_90d: number | null;
  place_6m: number | null;
  rating_6m: number | null;
  top1: number | null; // its best score today
  top8: number | null; // the average of its 8 best
};

export async function country(ioc: string): Promise<Country | null> {
  "use cache: remote";
  dataCache();
  const rows = await rpc<Country[]>("country", { ioc });
  return rows[0] ?? null;
}

export type CountryLeader = {
  weight: string;
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  place: number; // in the weight's table today
  score: number;
};

// The nation's best athlete in every weight today, in the site's order.
export async function countryLeaders(ioc: string): Promise<CountryLeader[]> {
  "use cache: remote";
  dataCache();
  return rpc<CountryLeader[]>("country_leaders", { ioc });
}

export type CountryWeek = { day: string; place: number; rating: number };

// Its mixed rating and place every week (Sundays), the earliest first.
export async function countryHistory(ioc: string): Promise<CountryWeek[]> {
  "use cache: remote";
  dataCache();
  return rpc<CountryWeek[]>("country_history", { ioc });
}

export type CountryTournament = {
  id: number;
  name: string;
  rank_name: string | null;
  date_from: string;
  athletes: number;
  gold: number;
  silver: number;
  bronze: number;
};

// The latest tournaments its athletes fought at, with their medals.
export async function countryTournaments(ioc: string): Promise<CountryTournament[]> {
  "use cache: remote";
  dataCache();
  return rpc<CountryTournament[]>("country_tournaments", { ioc, top: 5 });
}

export type HomeRow = {
  weight: string;
  place: number;
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  score: number;
  places_up_90d: number | null; // null: not in the table 90 days ago
  score_change_90d: number | null;
};

// The top 7 of every weight today, in the site's order.
export async function homeLeaders(): Promise<HomeRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<HomeRow[]>("home_leaders", { top: 7 });
}

// Of the top 20 of every weight, the biggest score changes over 90 days.
export async function biggestMovers(): Promise<HomeRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<HomeRow[]>("biggest_movers", { top: 5, pool: 20 });
}

export type RecentUpset = {
  contest_id: number;
  competition_id: number;
  competition: string;
  weight: string | null;
  round: string | null;
  fought_on: string;
  winner_id: number;
  winner_family_name: string | null;
  winner_given_name: string | null;
  winner_country: string | null;
  winner_chance: number;
  winner_score: number; // before the contest
  loser_id: number;
  loser_family_name: string | null;
  loser_given_name: string | null;
  loser_country: string | null;
  loser_score: number;
};

// The least likely wins at the tournaments of the last 30 days.
export async function recentUpsets(): Promise<RecentUpset[]> {
  "use cache: remote";
  dataCache();
  return rpc<RecentUpset[]>("recent_upsets", { days: 30, top: 4 });
}

export type UpcomingRow = {
  id: number;
  name: string;
  rank_name: string | null;
  city: string | null;
  country: string | null;
  date_from: string;
  date_to: string | null;
};

// The coming World Tour tournaments, the soonest first.
export async function upcoming(): Promise<UpcomingRow[]> {
  "use cache: remote";
  dataCache();
  return rpc<UpcomingRow[]>("upcoming", { top: 3 });
}

export type MedalChance = {
  weight: string;
  athlete_id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  gold: number; // 0..1, from playing the draw with today's ratings
  medal: number;
};

// At a tournament with a published draw: every athlete's chance of gold and of a
// medal, the likeliest medallists of every weight first. Empty before the draw.
export async function competitionChances(id: number): Promise<MedalChance[]> {
  "use cache: remote";
  dataCache();
  return rpc<MedalChance[]>("competition_chances", { competition_id: id });
}

// Every rated athlete, tournament and nation the search boxes look in, as one
// document (lib/search-index.ts searches it in the browser).
export async function searchIndex(): Promise<unknown> {
  "use cache";
  dataCache();
  return rpc<unknown>("search_index");
}
