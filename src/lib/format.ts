// judobase writes family names in capitals ("ABE").
function titleCase(name: string): string {
  return name.toLowerCase().replace(/(^|[\s'-])\p{L}/gu, (match) => match.toUpperCase());
}

// "Abe H." (narrow screens). A few athletes have only a given name.
export function shortName(familyName: string | null, givenName: string | null): string {
  if (!familyName) return givenName?.trim() || "—";
  const initial = givenName?.trim()[0];
  return initial ? `${titleCase(familyName)} ${initial.toUpperCase()}.` : titleCase(familyName);
}

// "Hifumi Abe", as in the athlete page's heading.
export function fullName(familyName: string | null, givenName: string | null): string {
  const given = givenName?.trim();
  if (!familyName) return given || "—";
  return given ? `${given} ${titleCase(familyName)}` : titleCase(familyName);
}

// Three-letter months everywhere ("Sep", while en-GB writes "Sept").
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-10-05" or an ISO timestamp -> "5 Oct 2026"
export function formatDate(value: string): string {
  const date = new Date(value);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "2026-10-05" -> "5 Oct"
export function shortDate(value: string): string {
  const date = new Date(value);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

// +18 / −23 / 0, with a real minus sign
export function signed(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

// A competition in a few letters, as in the design: "Grand Slam" in Abu Dhabi -> "GS ABU".
export function competitionCode(rank: string | null, city: string | null): string {
  const initials = (rank ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
  const place = (city ?? "").replace(/[^\p{L}]/gu, "").slice(0, 3).toUpperCase();
  return [initials, place].filter(Boolean).join(" ");
}

// judobase round names -> the short codes of the design (R32, QF, SF, BR, F…)
const ROUNDS: Record<string, string> = {
  "Round of 128": "R128",
  "Round of 64": "R64",
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-Final": "QF",
  "Quarter Final": "QF",
  "Semi-Final": "SF",
  "Semi Final": "SF",
  Repechage: "REP",
  Bronze: "BR",
  Final: "F",
};

export function roundCode(round: string | null): string {
  if (!round) return "";
  if (ROUNDS[round]) return ROUNDS[round];
  const pool = round.match(/^(Repechage )?Round (\d+)$/); // "Round 2", "Repechage Round 1"
  if (pool) return `${pool[1] ? "REP" : "R"}${pool[2]}`;
  return round.slice(0, 3).toUpperCase();
}

// "2026-03-14" -> "Mar 2026"
export function monthYear(value: string): string {
  const date = new Date(value);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "Paris Grand Slam 2026" -> "Paris GS 2026", as in the design's short lists.
export function shortCompetition(name: string): string {
  return name
    .replace(/Grand Slam/i, "GS")
    .replace(/Grand Prix/i, "GP")
    .replace(/World (Senior )?Championships?/i, "World Ch.")
    .replace(/\s+Individuals?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}
