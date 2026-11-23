"use client";

// The Portuguese dictionary for the browser: a chunk of its own, loaded on Portuguese pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { pt } from "@/i18n/pt";

export default function PtProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="pt" dict={pt}>
      {children}
    </LocaleProvider>
  );
}
