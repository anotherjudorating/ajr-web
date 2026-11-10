// Section anchors: links that open a page at one of its sections, e.g.
// /athletes/123#results. Hashes stay in the browser, so the pages stay cached as they are
// (docs/audits/2026-11-09-anchors-plan.md in ajr-backend).
//
// The ids are public, as the records' slugs: chosen once, by content, never renamed
// with a heading. Sections only: an anchor that also opens a state (a level of a
// table) fought the browser's and Next's own scroll to a missing id, and was dropped.
// No "use client": records' links (components/records/columns.tsx) use them too.

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
