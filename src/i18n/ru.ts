// Русский словарь: разделы в ru/, каждый `satisfies` свой раздел английского
// эталона, целое `satisfies Dict`, так что пропущенный или лишний ключ ломает tsc.
// Стиль: безлично, с «ё», без длинных тире и точек с запятой, стадии «1/16, 1/8,
// 1/4, 1/2, финал» (docs/audits/2026-11-21-i18n-plan-v2.md §6.5 и решения владельца
// от 22.11). Термины: src/i18n/GLOSSARY.md.

import type { Dict } from "./en";
import { athlete } from "./ru/athlete";
import { common } from "./ru/common";
import { contest } from "./ru/contest";
import { country } from "./ru/country";
import { explore } from "./ru/explore";
import { h2h } from "./ru/h2h";
import { home } from "./ru/home";
import { meta } from "./ru/meta";
import { methodology } from "./ru/methodology";
import { rankings } from "./ru/rankings";
import { records } from "./ru/records";
import { site } from "./ru/site";
import { tournament } from "./ru/tournament";

export const ru = {
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
