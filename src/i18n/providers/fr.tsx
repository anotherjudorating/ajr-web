"use client";

// The French dictionary for the browser: a chunk of its own, loaded on French pages only.

import type { ReactNode } from "react";

import { LocaleProvider } from "@/i18n/client";
import { fr } from "@/i18n/fr";

export default function FrProvider({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider lang="fr" dict={fr}>
      {children}
    </LocaleProvider>
  );
}
