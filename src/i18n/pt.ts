// The Portuguese dictionary (Brazilian): a section a file under pt/, each `satisfies`
// its section of the English reference, the whole `satisfies Dict`, so that a missing
// or extra key breaks tsc. Style: impersonal, no long dashes or semicolons, the stages
// "1/16, 1/8, 1/4, 1/2, final", athletes' and tournaments' names as in the data.
// Terms: src/i18n/GLOSSARY.md.

import type { Dict } from "./en";
import { athlete } from "./pt/athlete";
import { common } from "./pt/common";
import { contest } from "./pt/contest";
import { country } from "./pt/country";
import { explore } from "./pt/explore";
import { h2h } from "./pt/h2h";
import { home } from "./pt/home";
import { meta } from "./pt/meta";
import { methodology } from "./pt/methodology";
import { rankings } from "./pt/rankings";
import { records } from "./pt/records";
import { site } from "./pt/site";
import { tournament } from "./pt/tournament";

export const pt = {
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
