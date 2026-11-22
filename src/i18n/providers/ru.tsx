"use client";

// The Russian dictionary for the browser: a chunk of its own, loaded on Russian pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { ru } from "@/i18n/ru";

export default function RuProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="ru" dict={ru}>
      {children}
    </LocaleProvider>
  );
}
