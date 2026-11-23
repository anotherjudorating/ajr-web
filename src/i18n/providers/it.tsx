"use client";

// The Italian dictionary for the browser: a chunk of its own, loaded on Italian pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { it } from "@/i18n/it";

export default function ItProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="it" dict={it}>
      {children}
    </LocaleProvider>
  );
}
