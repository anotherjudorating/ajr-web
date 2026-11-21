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

// "7–8 Dec", "30 Nov–2 Dec", "5 Oct": a tournament's days
export function dateRange(from: string, to: string | null): string {
  const end = to ?? from;
  if (end === from) return shortDate(from);
  if (end.slice(0, 7) === from.slice(0, 7)) return `${new Date(from).getUTCDate()}–${shortDate(end)}`;
  return `${shortDate(from)}–${shortDate(end)}`;
}

// A place in English: 1st, 2nd, 3rd, 4th… 11th, 12th, 13th, 21st.
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${suffix}`;
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

// The stage of a draw, as the API gives it (ajr-backend ajr.fill_stages): counted
// from the final — F, 1/2, 1/4, 1/8 … 1/128; BR (bronze), REP (repechage); R1, R2…
// a tour of a round robin or of pools. A judobase name from before the stages (a
// cached page) is turned into one where it can be.
const LEGACY: Record<string, string> = {
  Final: "F",
  "Semi-Final": "1/2",
  "Semi Final": "1/2",
  "Quarter-Final": "1/4",
  "Quarter Final": "1/4",
  Bronze: "BR",
  Repechage: "REP",
};

export function roundCode(round: string | null): string {
  if (!round) return "";
  if (LEGACY[round]) return LEGACY[round];
  const of = round.match(/^(?:Round of|best) (\d+)$/i); // "Round of 16" -> 1/8
  if (of) return `1/${Number(of[1]) / 2}`;
  const tour = round.match(/^(?:Repechage )?Round (\d+)$/);
  if (tour) return round.startsWith("Repechage") ? "REP" : `R${tour[1]}`;
  return round;
}

// The stage written out, for a heading or a title: "Final", "Semi-final", "1/8 final".
export function roundTitle(round: string | null): string {
  const code = roundCode(round);
  const titles: Record<string, string> = {
    F: "Final",
    "1/2": "Semi-final",
    "1/4": "Quarter-final",
    BR: "Bronze medal contest",
    REP: "Repechage",
  };
  if (titles[code]) return titles[code];
  if (/^1\/\d+$/.test(code)) return `${code} final`;
  if (/^R\d+$/.test(code)) return `Round ${code.slice(1)}`;
  return code;
}

// "2026-03-14" -> "Mar 2026"
export function monthYear(value: string): string {
  const date = new Date(value);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "Paris Grand Slam 2026" -> "Paris GS 2026", as in the design's short lists.
export function shortCompetition(name: string): string {
  return name
    .replace(/^(OTP (Group|Bank)|PARK24 Group presents|Ecole Mont-Olivet)\s+/i, "") // sponsors
    .replace(/\s+-\s+[A-Z][a-z]+$/, "") // "… 2026 - Switzerland"
    .replace(/\s*\(Individuals?( and Teams)?\)/i, "")
    .replace(/\b(Individuals?|Seniors?|and Teams)\b/gi, "")
    .replace(/\bJudo\s+/i, "")
    .replace(/Grand Slam/i, "GS")
    .replace(/Grand Prix/i, "GP")
    .replace(/World Championships?/i, "World Ch.")
    .replace(/Central American and Caribbean/i, "CAC")
    .replace(/Pan[ -]?American/i, "Pan Am")
    .replace(/\bEuropean\b/i, "Eur.")
    .replace(/\bAfrican\b/i, "Afr.")
    .replace(/\bChampionships?\b/i, "Ch.")
    .replace(/\s+/g, " ")
    .trim();
}

// A chance as a percentage, to `digits` decimals (2 across the site; the records of
// chances show 3, their places being that close): 0.0174 -> "1.74%".
export function formatChance(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

// An athlete's profile on the IJF's site (our athlete ids are judobase's).
export function ijfProfile(id: number): string {
  return `https://www.ijf.org/judoka/${id}`;
}
