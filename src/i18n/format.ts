// Dates, places, stages, weights and numbers in the page's language. The English
// functions in lib/format.ts stay the reference (and are used where no language is
// known: the sitemap, the scripts); these give the same output for "en" byte for
// byte, and the language's own for the others. Reached through useFormat() in the
// browser and format() on the server.

import type { Dict } from "@/i18n/en";
import type { Lang } from "@/i18n/locales";
import { plural, t } from "@/i18n/t";
import { roundCode } from "@/lib/format";
import type { Weight } from "@/lib/weights";

export type Format = ReturnType<typeof localeFormat>;

const ORDINALS = new Map<Lang, Intl.PluralRules>();
const NUMBERS = new Map<Lang, Intl.NumberFormat>();

// toLocaleString("en-US") across the English site: "24,503"; Russian "24 503".
function numberFormat(lang: Lang): Intl.NumberFormat {
  let format = NUMBERS.get(lang);
  if (!format) NUMBERS.set(lang, (format = new Intl.NumberFormat(lang === "en" ? "en-US" : lang)));
  return format;
}

export function localeFormat(lang: Lang, dict: Dict) {
  const { common } = dict;
  const months = common.months;
  const shortDate = (value: string) => {
    const date = new Date(value);
    return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`;
  };
  return {
    lang,
    // "2026-10-05" or an ISO timestamp -> "5 Oct 2026"
    formatDate(value: string): string {
      const date = new Date(value);
      return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    },
    // "2026-10-05" -> "5 Oct"
    shortDate,
    // "7–8 Dec", "30 Nov–2 Dec", "5 Oct": a tournament's days
    dateRange(from: string, to: string | null): string {
      const end = to ?? from;
      if (end === from) return shortDate(from);
      if (end.slice(0, 7) === from.slice(0, 7)) return `${new Date(from).getUTCDate()}–${shortDate(end)}`;
      return `${shortDate(from)}–${shortDate(end)}`;
    },
    // "2026-03-14" -> "Mar 2026"
    monthYear(value: string): string {
      const date = new Date(value);
      return `${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    },
    // A place: 1st, 2nd, 3rd, 4th… 11th, 21st (the language's ordinal rules).
    ordinal(n: number): string {
      let rules = ORDINALS.get(lang);
      if (!rules) ORDINALS.set(lang, (rules = new Intl.PluralRules(lang, { type: "ordinal" })));
      return t(common.ordinal[rules.select(n)] ?? common.ordinal.other, { n });
    },
    // The stage written out, for a heading or a title: "Final", "Semi-final", "1/8 final".
    roundTitle(round: string | null): string {
      const code = roundCode(round);
      const named = (common.rounds as Record<string, string>)[code];
      if (named && !["ofFinal", "tour"].includes(code)) return named;
      if (/^1\/\d+$/.test(code)) return t(common.rounds.ofFinal, { code });
      if (/^R\d+$/.test(code)) return t(common.rounds.tour, { n: code.slice(1) });
      return code;
    },
    // "Men −73 kg"
    weightTitle(w: Weight): string {
      return t(common.weightTitle, { gender: common.gender[w.gender], label: w.label });
    },
    // A chance as a percentage, to `digits` decimals: 0.0174 -> "1.74%" (ru "1,74%").
    formatChance(value: number, digits = 2): string {
      const fixed = (value * 100).toFixed(digits);
      return `${lang === "en" ? fixed : fixed.replace(".", ",")}%`;
    },
    // 24503 -> "24,503"
    number(value: number): string {
      return numberFormat(lang).format(value);
    },
    // The count with its noun: plural(dict.common.contests, 5) -> "5 contests".
    count(forms: Dict["common"]["contests"], n: number, shown: string | number = n): string {
      return plural(lang, forms, n, shown);
    },
  };
}
