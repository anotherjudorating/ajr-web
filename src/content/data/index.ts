// The /data page's text by language (app/[lang]/data/page.tsx reads DATA_PROSE[lang]).

import type { Lang } from "@/i18n/locales";

import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pt } from "./pt";
import { ru } from "./ru";
import type { DataProse } from "./types";

export const DATA_PROSE: Record<Lang, DataProse> = { en, ru, fr, es, it, pt };
