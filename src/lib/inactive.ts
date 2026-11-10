import type { HistoryRow } from "@/lib/api";

// No contest for this long: out of the tables (hide_after_days in the rating settings).
export const INACTIVE_DAYS = 365;

export type LastRating = { day: string; score: number; rating: number };

// An athlete without a contest for over a year: their last rating, as it was after
// that contest. Shown instead of today's, which only the growing uncertainty has
// pulled down since (the rating itself holds). Null for an active athlete.
export function lastRating(history: HistoryRow[], today: string): LastRating | null {
  const last = history[0]; // latest first
  if (!last) return null;
  const days = (new Date(today).getTime() - new Date(last.fought_on).getTime()) / 86_400_000;
  return days > INACTIVE_DAYS ? { day: last.fought_on, score: last.score_after, rating: last.rating_after } : null;
}
