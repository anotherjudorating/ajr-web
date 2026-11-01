import { cacheLife } from "next/cache";

import { athleteHistory, leaderboard } from "@/lib/api";
import type { Picked } from "@/lib/h2h";
import { WEIGHTS } from "@/lib/weights";

export type Matchup = {
  weight: string; // slug
  a: Picked;
  b: Picked;
  wins: number; // of a
  losses: number;
  last: string; // YYYY-MM-DD
};

// "Popular matchups" with no view counts yet: the leader of every weight against the
// one of today's top 20 they met most often, the four longest rivalries of those.
export async function popularMatchups(): Promise<Matchup[]> {
  "use cache";
  cacheLife("data");
  const found = await Promise.all(
    WEIGHTS.map(async (weight): Promise<Matchup | null> => {
      const rows = await leaderboard(weight.api);
      const [leader, ...others] = rows;
      if (!leader) return null;
      const top = new Map(others.slice(0, 19).map((row) => [row.athlete_id, row]));
      const history = await athleteHistory(leader.athlete_id);
      const meetings = new Map<number, typeof history>();
      for (const contest of history) {
        if (!top.has(contest.opponent_id)) continue;
        meetings.set(contest.opponent_id, [...(meetings.get(contest.opponent_id) ?? []), contest]);
      }
      // the most meetings; of equal ones the latest rivalry (history comes latest first)
      let best: typeof history = [];
      for (const contests of meetings.values()) {
        if (contests.length > best.length || (contests.length === best.length && contests[0].fought_on > best[0].fought_on)) {
          best = contests;
        }
      }
      if (!best.length) return null;
      const rival = top.get(best[0].opponent_id)!;
      const wins = best.filter((contest) => contest.won).length;
      return {
        weight: weight.slug,
        a: picked(leader),
        b: picked(rival),
        wins,
        losses: best.length - wins,
        last: best[0].fought_on,
      };
    }),
  );
  return found
    .filter((matchup) => matchup !== null)
    .sort((x, y) => y.wins + y.losses - (x.wins + x.losses) || y.last.localeCompare(x.last))
    .slice(0, 4);
}

function picked(row: Awaited<ReturnType<typeof leaderboard>>[number]): Picked {
  return {
    id: row.athlete_id,
    family_name: row.family_name,
    given_name: row.given_name,
    country: row.country,
    score: row.score,
  };
}
