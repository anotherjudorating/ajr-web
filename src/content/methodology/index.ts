// The methodology's prose by language (app/[lang]/methodology/page.tsx reads PROSE[lang]).

import type { Lang } from "@/i18n/locales";

import { en } from "./en";
import { ru } from "./ru";
import type { Prose } from "./types";

export const PROSE: Record<Lang, Prose> = { en, ru };
