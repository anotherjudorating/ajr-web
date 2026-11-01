import { cacheLife } from "next/cache";

import { popularMatchupRows } from "@/lib/api";
import type { Picked } from "@/lib/h2h";
import { WEIGHTS } from "@/lib/weights";

export type Matchup = {
  weight: string | null; // slug
  a: Picked;
  b: Picked;
  wins: number; // of a
  losses: number;
  last: string | null; // YYYY-MM-DD, null when they never met
};

// Until people have opened enough pairs (the backend counts them), these: the top
// rivalries of today's men and women.
const FALLBACK: [number, number][] = [
  [13208, 57666], // Abe H. – Takeoka T., −66
  [38158, 43175], // Sulamanidze I. – Kanikovskiy M., −100
  [21360, 8178], // Tasoev I. – Tushishvili G., +100
  [44249, 30263], // Murao S. – Bekauri L., −90
  [35696, 7829], // Abe U. – Krasniqi D., −52
  [66481, 20253], // Omori A. – Liparteliani E., −57
];

// The most opened pairs, or the list above while there are few openings.
export async function popularMatchups(): Promise<Matchup[]> {
  "use cache";
  cacheLife("data");
  const rows = await popularMatchupRows(FALLBACK.flat());
  return rows.map((row) => ({
    weight: WEIGHTS.find((w) => w.api === row.weight)?.slug ?? null,
    a: { id: row.a, family_name: row.a_family_name, given_name: row.a_given_name, country: row.a_country, score: row.a_score },
    b: { id: row.b, family_name: row.b_family_name, given_name: row.b_given_name, country: row.b_country, score: row.b_score },
    wins: row.wins,
    losses: row.losses,
    last: row.last_meeting,
  }));
}
