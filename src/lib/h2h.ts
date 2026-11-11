// Head-to-head: shared by the server page and the client picker and chart.

// An athlete in a picker slot, in the popular matchups and on the chart.
export type Picked = {
  id: number;
  family_name: string | null;
  given_name: string | null;
  country: string | null;
  score: number | null;
};

// Glicko's expected score of the first athlete, with the uncertainty of both: two
// shaky ratings make a closer call than their difference says.
// From each side's rating (skill − RD_FACTOR × RD), as the backend's
// (ajr/rating/glicko2.py win_probability): it predicts better than the skill alone.
export function winChance(rating1: number, rd1: number, rating2: number, rd2: number): number {
  const q = 173.7178;
  const phi = Math.sqrt(rd1 * rd1 + rd2 * rd2) / q;
  const g = 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
  const gap = rating1 - RD_FACTOR * rd1 - (rating2 - RD_FACTOR * rd2);
  return 1 / (1 + Math.exp((-g * gap) / q));
}

// The site's rating is skill − RD_FACTOR × RD (ajr-backend RatingParams.rd_factor).
export const RD_FACTOR = 1;

// "/head-to-head?w=men-73&a=13028&b=18842". Without `w` the page takes the weight of
// the athletes.
export function h2hPath(weightSlug: string | null, a: number | null, b: number | null): string {
  const query = new URLSearchParams();
  if (weightSlug) query.set("w", weightSlug);
  if (a !== null) query.set("a", String(a));
  if (b !== null) query.set("b", String(b));
  const text = query.toString();
  return text ? `/head-to-head?${text}` : "/head-to-head";
}

// Athlete 1 in ink, athlete 2 in oxford blue: the picker's marks, the table, the chart.
export const COLORS = { a: "#33302E", b: "#0F5499" } as const;
