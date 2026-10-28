// The 14 senior weight categories. `slug` is the URL part, `api` the value the
// backend uses ("-73", "+100").

export type Weight = { slug: string; api: string; gender: "men" | "women"; label: string };

function weight(gender: "men" | "women", api: string): Weight {
  const plus = api.startsWith("+");
  const kg = api.slice(1);
  return {
    slug: `${gender}-${plus ? "plus-" : ""}${kg}`,
    api,
    gender,
    label: `${plus ? "+" : "−"}${kg}`, // real minus sign, as in the design
  };
}

export const MEN = ["-60", "-66", "-73", "-81", "-90", "-100", "+100"].map((w) => weight("men", w));
export const WOMEN = ["-48", "-52", "-57", "-63", "-70", "-78", "+78"].map((w) => weight("women", w));
export const WEIGHTS = [...MEN, ...WOMEN];

export const DEFAULT_WEIGHT = MEN[2]; // men −73

export function weightBySlug(slug: string): Weight | undefined {
  return WEIGHTS.find((w) => w.slug === slug);
}

export function weightTitle(w: Weight): string {
  return `${w.gender === "men" ? "Men" : "Women"} ${w.label} kg`;
}
