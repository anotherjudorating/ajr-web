// Section anchors: links that open a page at one of its sections, e.g.
// /athletes/123#results. Hashes stay in the browser, so the pages stay cached as they are
// (docs/audits/2026-11-09-anchors-plan.md in ajr-backend).
//
// The ids are public, as the records' slugs: chosen once, by content, never renamed
// with a heading. Sections only: an anchor that also opens a state (a level of a
// table) fought the browser's and Next's own scroll to a missing id, and was dropped.
// No "use client": records' links (components/records/columns.tsx) use them too.

import { WEIGHTS } from "@/lib/weights";

export const SECTION = {
  // athlete
  results: "results",
  contests: "contests",
  bestWins: "best-wins",
  toughestLosses: "toughest-losses",
  opponents: "opponents",
  // tournament
  men: "men",
  women: "women",
  nations: "nations",
  upsets: "upsets",
  gains: "gains",
  // head-to-head
  meetings: "meetings",
} as const;

// A link to a page's section: anchor("/athletes/1", SECTION.results, "grand-slam").
export const anchor = (path: string, id?: string, qualifier?: string) =>
  id ? `${path}#${id}${qualifier ? `-${qualifier}` : ""}` : path;

// What a hash says about section `id`: null (not this section), "" (the section), or
// the qualifier after "id-".
export function targetOf(hash: string, id: string): string | null {
  if (hash === id) return "";
  return hash.startsWith(`${id}-`) ? hash.slice(id.length + 1) : null;
}

// The table where an athlete's peak shows: the peak's weight on the Monday after it
// (a day's table is its week's Monday's, and a peak comes at a weekend tournament, so
// the Monday before has not seen it yet), today's table if that Monday has not come,
// at the athlete's row (#athlete-<id>: the table opens its page and marks it).
export function peakTableLink(athlete: { id: number; peak_on: string | null; peak_weight: string | null }, today: string): string | null {
  const weight = WEIGHTS.find((w) => w.api === athlete.peak_weight);
  if (!weight || !athlete.peak_on) return null;
  const day = new Date(`${athlete.peak_on}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + (8 - day.getUTCDay()) % 7 || 7); // the next Monday, never the same day
  const monday = day.toISOString().slice(0, 10);
  const path = monday >= today ? `/rankings/${weight.slug}` : `/rankings/${weight.slug}/${monday}`;
  return `${path}#${athleteRow(athlete.id)}`;
}

// A table row's id: the anchor of an athlete in a ranking table.
export const athleteRow = (id: number) => `athlete-${id}`;
