import type { Metadata } from "next";
import { Suspense } from "react";

import { NationsBrowser } from "@/components/explore/NationsBrowser";
import { nations } from "@/lib/api";
import { i18n } from "@/i18n/server";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, d } = await i18n();
  return {
    title: d.explore.nations.meta.title,
    description: d.explore.nations.meta.description,
    alternates: alternatesFor(lang, "/explore/nations"),
  };
}

export default function NationsPage() {
  return (
    <Suspense fallback={<NationsBrowser loading rows={[]} />}>
      <Nations />
    </Suspense>
  );
}

async function Nations() {
  return <NationsBrowser rows={await nations()} />;
}
