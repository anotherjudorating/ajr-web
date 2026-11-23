// The Italian dictionary: the sections in it/, each `satisfies` its section of the English
// reference, the whole `satisfies Dict`, so that a missing or extra key breaks tsc.
// Style: impersonal, no long dashes or semicolons, the stages "1/16, 1/8, 1/4, 1/2,
// finale", athletes' and tournaments' names as the data writes them. Terms: src/i18n/GLOSSARY.md.

import type { Dict } from "./en";
import { athlete } from "./it/athlete";
import { common } from "./it/common";
import { contest } from "./it/contest";
import { country } from "./it/country";
import { explore } from "./it/explore";
import { h2h } from "./it/h2h";
import { home } from "./it/home";
import { meta } from "./it/meta";
import { methodology } from "./it/methodology";
import { rankings } from "./it/rankings";
import { records } from "./it/records";
import { site } from "./it/site";
import { tournament } from "./it/tournament";

export const it = {
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
