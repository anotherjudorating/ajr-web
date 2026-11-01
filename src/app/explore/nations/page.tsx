import type { Metadata } from "next";
import { Suspense } from "react";

import { NationsBrowser } from "@/components/explore/NationsBrowser";
import { nations } from "@/lib/api";

export const metadata: Metadata = { title: "Nations — judo countries with rated athletes" };

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
