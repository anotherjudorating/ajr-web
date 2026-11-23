// The Spanish dictionary: the sections in es/, each `satisfies` its section of the
// English reference, the whole `satisfies Dict`, so that a missing or extra key breaks
// tsc. Style: impersonal, no long dashes or semicolons, the stages "1/16, 1/8, 1/4,
// 1/2, final" (docs/audits/2026-11-21-i18n-plan-v2.md §6.5 and the owner's decisions of
// 22.11). Terms: src/i18n/GLOSSARY.md.

import type { Dict } from "./en";
import { athlete } from "./es/athlete";
import { common } from "./es/common";
import { contest } from "./es/contest";
import { country } from "./es/country";
import { explore } from "./es/explore";
import { h2h } from "./es/h2h";
import { home } from "./es/home";
import { meta } from "./es/meta";
import { methodology } from "./es/methodology";
import { rankings } from "./es/rankings";
import { records } from "./es/records";
import { site } from "./es/site";
import { tournament } from "./es/tournament";

export const es = {
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
} satisfies Dict;
