// The methodology's prose by language (app/[lang]/methodology/page.tsx reads PROSE[lang]).

import type { Lang } from "@/i18n/locales";

import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pt } from "./pt";
import { ru } from "./ru";
import type { Prose } from "./types";

export const PROSE: Record<Lang, Prose> = { en, ru, fr, es, it, pt };
