// The /contact page's text by language (app/[lang]/contact/page.tsx reads CONTACT_PROSE[lang]).

import type { Lang } from "@/i18n/locales";

import { en } from "./en";
import { ru } from "./ru";
import type { ContactProse } from "./types";

export const CONTACT_PROSE: Record<Lang, ContactProse> = { en, ru };
