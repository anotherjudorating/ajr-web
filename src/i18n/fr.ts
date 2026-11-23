// The French dictionary: the sections in fr/, each `satisfies` its section of the
// English reference, the whole `satisfies Dict`, so that a missing or extra key breaks
// tsc. Style: impersonal, no long dashes or semicolons, the stages "1/16, 1/8, 1/4, 1/2,
// finale" (docs/audits/2026-11-21-i18n-plan-v2.md §6.5 and the owner's decisions of
// 22.11). Terms: src/i18n/GLOSSARY.md.

import type { Dict } from "./en";
import { athlete } from "./fr/athlete";
import { common } from "./fr/common";
import { contest } from "./fr/contest";
import { country } from "./fr/country";
import { explore } from "./fr/explore";
import { h2h } from "./fr/h2h";
import { home } from "./fr/home";
import { meta } from "./fr/meta";
import { methodology } from "./fr/methodology";
import { rankings } from "./fr/rankings";
import { records } from "./fr/records";
import { site } from "./fr/site";
import { tournament } from "./fr/tournament";

export const fr = {
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
