// The /data page's text, one file a language (en.tsx, ru.tsx). The files' table, the
// schema.org Dataset (English, for machines) and the addresses are the page's.

import type { ReactNode } from "react";

export const LICENSE = "https://creativecommons.org/licenses/by/4.0/";
export const CONTACT = "data@anotherjudorating.com";
export const JUDOBASE = "https://judobase.ijf.org/#/dashboard";
export const LINK = "underline hover:text-ink";

export type DataProse = {
  meta: { title: string; description: string };
  title: string;
  intro: ReactNode;
  rebuilt: ReactNode;
  files: string;
  updated: string; // "Updated {date}."
  file: string;
  rows: string;
  size: string;
  preparing: string;
  licenseTitle: string;
  license: ReactNode;
  source: ReactNode;
  cite: (site: string) => ReactNode;
  questions: ReactNode;
};
