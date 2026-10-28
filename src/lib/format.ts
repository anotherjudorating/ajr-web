// judobase writes family names in capitals ("ABE"); the design shows "Abe H.".
export function shortName(familyName: string, givenName: string | null): string {
  const family = familyName
    .toLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (match) => match.toUpperCase());
  const initial = givenName?.trim()[0];
  return initial ? `${family} ${initial.toUpperCase()}.` : family;
}

// Three-letter months everywhere ("Sep", while en-GB writes "Sept").
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-10-05" or an ISO timestamp -> "5 Oct 2026"
export function formatDate(value: string): string {
  const date = new Date(value);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// +18 / −23 / 0, with a real minus sign
export function signed(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}
