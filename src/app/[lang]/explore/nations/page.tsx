import type { Metadata } from "next";
import { Suspense } from "react";

import { NationsBrowser } from "@/components/explore/NationsBrowser";
import { nations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Judo nations and their rated athletes",
  description: "Every judo nation with a rated athlete: how many it has and how many stand in today's tables, with a page for each.",
};

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
