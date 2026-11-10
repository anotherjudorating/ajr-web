import type { Athlete, HistoryRow } from "@/lib/api";
import { type Places, placeOn } from "@/lib/places";

// What the athlete page's header shows for the weight picked in its tabs: the place,
// the places gained and the IJF place in that weight's table today (api.athlete's
// `tables`; none when not listed there), and the peak in that weight: the best score
// at the end of a day of contests in it (the earliest such day) of a week the athlete
// stood in that weight's table, with the place then (the places file, lib/places.ts);
// none when never in that table (a weight fought once, listed in another). The rating
// is one for all weights.
// The peak api.athlete computed (its table's place that day, exactly) stands for its
// own weight.
export type WeightView = Pick<
  Athlete,
  "place" | "wrl_place" | "places_up_90d" | "places_up_6m" | "peak_score" | "peak_on" | "peak_place" | "peak_weight"
>;

export function weightView(athlete: Athlete, weight: string | null, history: HistoryRow[], places: Places | null): WeightView {
  const table = athlete.tables?.find((t) => t.weight === weight);
  const listed = {
    place: table?.place ?? null,
    wrl_place: table?.wrl_place ?? null,
    places_up_90d: table?.places_up_90d ?? null,
    places_up_6m: table?.places_up_6m ?? null,
  };
  if (!weight || weight === athlete.peak_weight) {
    const own = { peak_score: athlete.peak_score, peak_on: athlete.peak_on, peak_place: athlete.peak_place, peak_weight: athlete.peak_weight };
    // the listing weight (or none): api.athlete's own fields; another: its table's
    return { ...(!weight || weight === athlete.weight ? pick(athlete) : listed), ...own };
  }
  // the best end of a day in this weight (history is latest first: a day's first row
  // is its last contest)
  let best: { row: HistoryRow; place: number } | null = null;
  const seen = new Set<string>();
  for (const row of history) {
    if (row.weight !== weight || seen.has(row.fought_on)) continue;
    seen.add(row.fought_on);
    const week = placeOn(places, new Date(row.fought_on).getTime());
    if (!week || week.weight !== weight) continue; // not in this weight's table then
    if (!best || row.score_after >= best.row.score_after) best = { row, place: week.place }; // earlier wins a tie
  }
  return {
    ...(weight === athlete.weight ? pick(athlete) : listed),
    peak_score: best ? best.row.score_after : null,
    peak_on: best ? best.row.fought_on : null,
    peak_place: best ? best.place : null,
    peak_weight: best ? weight : null,
  };
}

const pick = (a: Athlete) => ({ place: a.place, wrl_place: a.wrl_place, places_up_90d: a.places_up_90d, places_up_6m: a.places_up_6m });
