import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { P4PBrowser } from "@/components/rankings/P4PBrowser";
import { p4p } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { NOINDEX } from "@/lib/seo";

const GENDERS = { men: "Men", women: "Women" } as const;
type Gender = keyof typeof GENDERS;

export function generateStaticParams() {
  return Object.keys(GENDERS).map((gender) => ({ gender, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/p4p/[gender]/[[...day]]">): Promise<Metadata> {
  const { gender, day } = await params;
  if (!(gender in GENDERS)) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const title = `${GENDERS[gender as Gender]} pound for pound — judo ranking`;
  return day?.length
    ? { title: `${title} on ${day[0]}`, robots: NOINDEX } // a past day
    : { title, description: `The best ${GENDERS[gender as Gender].toLowerCase()} judoka across all weights: how far each stands above the rest of their category, by Glicko-2 rating.` };
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
      <BreadcrumbData trail={[{ href: "/rankings", label: "Rankings" }]} current={`${GENDERS[gender as Gender]} pound for pound`} />
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
