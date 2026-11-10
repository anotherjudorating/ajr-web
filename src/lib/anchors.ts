// Section anchors: links that open a page at one of its sections, e.g.
// /athletes/123#results, or with a state, /athletes/123#results-grand-slam (that level
// opened). Hashes stay in the browser, so the pages stay cached as they are
// (docs/audits/2026-11-09-anchors-plan.md in ajr-backend).
//
// The ids are public, as the records' slugs: chosen once, by content, never renamed
// with a heading. A qualifier (after "-") comes only from a slug table in the code.
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

// The athlete page's tournament levels (components/athlete/Medals.tsx), by title.
export const LEVEL_SLUGS: Record<string, string> = {
  "Olympic Games": "olympic-games",
  "World Championships": "world-championships",
  "Continental Championships": "continental-championships",
  Masters: "masters",
  "Grand Slam": "grand-slam",
  "Grand Prix": "grand-prix",
  "Continental Opens & Cups": "continental-opens",
  Other: "other",
};

// A link to a page's section: anchor("/athletes/1", SECTION.results, "grand-slam").
export const anchor = (path: string, id?: string, qualifier?: string) =>
  id ? `${path}#${id}${qualifier ? `-${qualifier}` : ""}` : path;

// What a hash says about section `id`: null (not this section), "" (the section), or
// the qualifier after "id-".
export function targetOf(hash: string, id: string): string | null {
  if (hash === id) return "";
  return hash.startsWith(`${id}-`) ? hash.slice(id.length + 1) : null;
}
