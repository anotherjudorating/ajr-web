import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { P4PBrowser } from "@/components/rankings/P4PBrowser";
import { p4p } from "@/lib/api";
import { tableDay } from "@/lib/days";

const GENDERS = { men: "Men", women: "Women" } as const;
type Gender = keyof typeof GENDERS;

export function generateStaticParams() {
  return Object.keys(GENDERS).map((gender) => ({ gender, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/p4p/[gender]/[[...day]]">): Promise<Metadata> {
  const { gender } = await params;
  return gender in GENDERS ? { title: `${GENDERS[gender as Gender]} pound for pound — judo ranking` } : {};
}

export default function Page({ params }: PageProps<"/rankings/p4p/[gender]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<P4PBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} />
    </Suspense>
  );
}

async function Table({ params }: { params: PageProps<"/rankings/p4p/[gender]/[[...day]]">["params"] }) {
  const { gender, day } = await params;
  if (!(gender in GENDERS)) notFound();
  const path = `/rankings/p4p/${gender}`;
  const { asOf, latest, past } = await tableDay(day);
  const rows = await p4p(gender, past);
  return (
    <>
      <h1 className="sr-only">{GENDERS[gender as Gender]} pound for pound — judo ranking</h1>
      <P4PBrowser
        key={asOf}
        rows={rows}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-p4p-${gender}-${asOf}.csv`}
      />
    </>
  );
}
