// Russian. Stage 1a (the infrastructure): the strings are English, so a page under
// /ru/ reads as the English one with lang="ru". Stage 1b replaces every section with
// its translation; `satisfies Dict` fails the type check on a missing or extra key.
// Style: impersonal, "ё" written, no long dashes, no semicolons, rounds "1/16, 1/8,
// 1/4, 1/2, финал" (docs/audits/2026-11-21-i18n-plan-v2.md §6.5 and the owner's
// decisions of 22.11).

import { type Dict, en } from "./en";

export const ru = {
  ...en,
} satisfies Dict;
