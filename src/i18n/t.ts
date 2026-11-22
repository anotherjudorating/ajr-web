// Filling a dictionary string: "{from} to {to} of {total}", and the plural forms of
// a count. Strings, not functions, so that they serialise, export to a table for
// proofreading and can be translated by people who do not read code.

import type { Lang } from "@/i18n/locales";

// The forms a language needs (Intl.PluralRules names them): English `one` and
// `other`, Russian `one` (1, 21), `few` (2-4), `many` (5-20, 0) and `other`. `{n}`
// in a form stands for the count.
export type Plural = { zero?: string; one?: string; two?: string; few?: string; many?: string; other: string };

// Marks a plural in the dictionary, so that its type is the forms, not the literal.
export const forms = (p: Plural): Plural => p;

export type Vars = Record<string, string | number>;

// "Shown {from} to {to}" + { from: 1, to: 50 } -> "Shown 1 to 50". A name with no
// value stays as it is, visible: a missing substitution should be seen, not hidden.
export function t(template: string, vars: Vars): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

const RULES = new Map<Lang, Intl.PluralRules>();

// The form for `n`, filled: plural("en", d.contests, 5) -> "5 contests". `n` is put
// in as given (a formatted string for thousands) and goes into the rule as a number.
export function plural(lang: Lang, p: Plural, n: number, shown: string | number = n, vars: Vars = {}): string {
  let rules = RULES.get(lang);
  if (!rules) RULES.set(lang, (rules = new Intl.PluralRules(lang)));
  const form = p[rules.select(n)] ?? p.other;
  return t(form, { n: shown, ...vars });
}
