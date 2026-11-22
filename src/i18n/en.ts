// The site's strings, in English: the reference every other language is typed
// against (ru.ts `satisfies Dict`). Each section is a file under en/, named after
// the part of the site it serves. "{name}" is a substitution (t in t.ts), forms()
// a plural (plural in t.ts). The Russian style rules and the glossary:
// docs/audits/2026-11-21-i18n-plan-v2.md §6.5 (ajr-backend).

import { common } from "./en/common";
import { meta } from "./en/meta";
import { site } from "./en/site";

export const en = {
  site,
  common,
  meta,
};

export type Dict = typeof en;
