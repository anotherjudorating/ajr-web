"use client";

// The English dictionary for the browser: a chunk of its own, loaded on English pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { en } from "@/i18n/en";

export default function EnProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="en" dict={en}>
      {children}
    </LocaleProvider>
  );
}
