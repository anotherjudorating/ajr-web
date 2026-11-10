import type { Athlete, HistoryRow } from "@/lib/api";
import { type Places, placeOn } from "@/lib/places";

// What the athlete page's header shows for the weight picked in its tabs: the place,
// the places gained and the IJF place in that weight's table today (api.athlete's
// `tables`; none when not listed there), and the peak in that weight: the best score
// at the end of a day of contests in it (the earliest such day), with the place that
// week from the places file (lib/places.ts). The rating is one for all weights.
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
  let best: HistoryRow | null = null;
  const seen = new Set<string>();
  for (const row of history) {
    if (row.weight !== weight || seen.has(row.fought_on)) continue;
    seen.add(row.fought_on);
    if (!best || row.score_after >= best.score_after) best = row; // earlier wins a tie
  }
  const week = best ? placeOn(places, new Date(best.fought_on).getTime()) : null;
  return {
    ...(weight === athlete.weight ? pick(athlete) : listed),
    peak_score: best ? best.score_after : null,
    peak_on: best ? best.fought_on : null,
    peak_place: week && week.weight === weight ? week.place : null,
    peak_weight: best ? weight : null,
  };
}

const pick = (a: Athlete) => ({ place: a.place, wrl_place: a.wrl_place, places_up_90d: a.places_up_90d, places_up_6m: a.places_up_6m });
