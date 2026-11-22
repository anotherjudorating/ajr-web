// The site's strings, in English: the reference every other language is typed
// against (ru.ts `satisfies Dict`). Each section is a file under en/, named after
// the part of the site it serves. "{name}" is a substitution (t in t.ts), forms()
// a plural (plural in t.ts). The Russian style rules and the glossary:
// docs/audits/2026-11-21-i18n-plan-v2.md §6.5 (ajr-backend).

import { athlete } from "./en/athlete";
import { common } from "./en/common";
import { contest } from "./en/contest";
import { country } from "./en/country";
import { explore } from "./en/explore";
import { h2h } from "./en/h2h";
import { home } from "./en/home";
import { meta } from "./en/meta";
import { methodology } from "./en/methodology";
import { rankings } from "./en/rankings";
import { records } from "./en/records";
import { site } from "./en/site";
import { tournament } from "./en/tournament";

export const en = {
  site,
  common,
  meta,
  home,
  rankings,
  athlete,
  h2h,
  tournament,
  contest,
  country,
  explore,
  records,
  methodology,
};

export type Dict = typeof en;
