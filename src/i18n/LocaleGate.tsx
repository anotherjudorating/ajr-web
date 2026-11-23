"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

import type { Lang } from "@/i18n/locales";

// The dictionary a page hands the browser: the provider of its language, and only
// that one. Each provider is imported on demand from a client component, which gives
// every language its own chunk (imported statically, or on demand from the layout, a
// server component, Turbopack put them all in the chunk every page loads). Rendered
// on the server as any component: the HTML is the same, the chunk is preloaded.
const PROVIDERS: Record<Lang, ComponentType<{ children: ReactNode }>> = {
  en: dynamic(() => import("@/i18n/providers/en")),
  ru: dynamic(() => import("@/i18n/providers/ru")),
  fr: dynamic(() => import("@/i18n/providers/fr")),
  es: dynamic(() => import("@/i18n/providers/es")),
  it: dynamic(() => import("@/i18n/providers/it")),
  pt: dynamic(() => import("@/i18n/providers/pt")),
};

export function LocaleGate({ lang, children }: { lang: Lang; children: ReactNode }) {
  const Provider = PROVIDERS[lang];
  return <Provider>{children}</Provider>;
}
