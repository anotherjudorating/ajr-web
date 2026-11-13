import type { HistoryRow } from "@/lib/api";
import type { Places } from "@/lib/places";

// An athlete's standing over the weeks (lib/places.ts: the place every Monday), in a
// weight and pound for pound: the best place in the weight — of the weeks at it, the
// one with the highest rating — and the weeks at #1, each with its longest run. Null
// without the weekly places.
// `from`, `to`: the first and the last Monday of the longest run.
export type Run = { weeks: number; longest: number; from: string | null; to: string | null };
// A run picked in the header, shown on the Rank chart: its weeks and what they were.
export type Highlight = { from: string; to: string; label: string };
export type Standing = { best: number; bestOn: string; atOne: Run; p4pAtOne: Run };

const DAY = 86_400_000;
// As the records (ajr/records/queries.py RATINGS_SINCE): the ratings from 2011 on, when
// they had settled; the weeks, the runs and the charts of an athlete start then too.
export const SINCE = Date.parse("2011-01-01T00:00:00Z");
const RD_GROWTH = 5; // the engine's (ajr.rating_settings): RD² grows by 5² a day
const MAX_RD = 350;

// The shown rating on a Monday: the last contest before it, its uncertainty grown since.
function scoreOn(history: HistoryRow[], monday: number): number {
  let last: HistoryRow | null = null;
  for (const row of history) if (Date.parse(row.fought_on) < monday && (!last || row.fought_on >= last.fought_on)) last = row;
  if (!last) return -Infinity;
  const days = (monday - Date.parse(last.fought_on)) / DAY;
  return last.rating_after - Math.min(Math.sqrt(last.rd_after ** 2 + RD_GROWTH ** 2 * days), MAX_RD);
}

function runs(flags: boolean[], mondayOf: (index: number) => number): Run {
  let weeks = 0;
  let current = 0;
  let longest = 0;
  let end = -1;
  flags.forEach((on, index) => {
    current = on ? current + 1 : 0;
    if (on) weeks++;
    if (current > longest) [longest, end] = [current, index];
  });
  const day = (index: number) => new Date(mondayOf(index)).toISOString().slice(0, 10);
  return { weeks, longest, from: longest ? day(end - longest + 1) : null, to: longest ? day(end) : null };
}

export function standingOf(places: Places | null, weight: string | null, history: HistoryRow[]): Standing | null {
  if (!places || !weight) return null;
  const from = Date.parse(`${places.from}T00:00:00Z`);
  const mondayOf = (index: number) => from + 7 * DAY * index;
  // the weeks from SINCE on
  const counted = places.weeks.map((week, index) => (mondayOf(index) >= SINCE ? week : null));
  const inWeight = counted.map((week) => (week && week[1] === weight ? week[0] : null));
  const best = Math.min(...inWeight.filter((place): place is number => place !== null));
  if (!Number.isFinite(best)) return null;
  // the weeks at the best place: the one with the highest rating
  let bestIndex = -1;
  let bestScore = -Infinity;
  inWeight.forEach((place, index) => {
    if (place !== best) return;
    const score = scoreOn(history, mondayOf(index));
    if (bestIndex < 0 || score > bestScore) [bestIndex, bestScore] = [index, score];
  });
  const p4p = counted.map((week) => week?.[2] ?? null);
  return {
    best,
    bestOn: new Date(mondayOf(bestIndex)).toISOString().slice(0, 10),
    atOne: runs(inWeight.map((place) => place === 1), mondayOf),
    p4pAtOne: runs(p4p.map((place) => place === 1), mondayOf),
  };
}
