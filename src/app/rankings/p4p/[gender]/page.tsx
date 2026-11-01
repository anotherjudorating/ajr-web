import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { P4PBrowser } from "@/components/rankings/P4PBrowser";
import { p4p } from "@/lib/api";
import { tableDay } from "@/lib/days";

const GENDERS = { men: "Men", women: "Women" } as const;
type Gender = keyof typeof GENDERS;

export function generateStaticParams() {
  return Object.keys(GENDERS).map((gender) => ({ gender }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/p4p/[gender]">): Promise<Metadata> {
  const { gender } = await params;
  return gender in GENDERS ? { title: `${GENDERS[gender as Gender]} pound for pound — judo ranking` } : {};
}

export default function Page({ params, searchParams }: PageProps<"/rankings/p4p/[gender]">) {
  // the URL is read inside the Suspense, so the page's shell is static and a move
  // between tables is instant; meanwhile the toolbar and the table's header show
  return (
    <Suspense fallback={<P4PBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Table({ params, searchParams }: PageProps<"/rankings/p4p/[gender]">) {
  const { gender } = await params;
  if (!(gender in GENDERS)) notFound();
  const path = `/rankings/p4p/${gender}`;
  const { asOf, latest, past } = await tableDay((await searchParams).date);
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
