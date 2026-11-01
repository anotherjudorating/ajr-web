import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { P4PBrowser } from "@/components/rankings/P4PBrowser";
import { WeightSwitcher } from "@/components/WeightSwitcher";
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

export default async function Page({ params, searchParams }: PageProps<"/rankings/p4p/[gender]">) {
  const { gender } = await params;
  if (!(gender in GENDERS)) notFound();
  const path = `/rankings/p4p/${gender}`;

  // while the table loads, the switcher, the toolbar and the table's header stay
  const loading = (
    <>
      <WeightSwitcher current={path} />
      <P4PBrowser loading rows={[]} asOf="" latest="" path={path} csvName="" />
    </>
  );

  return (
    <div className="w-full bg-paper pt-6 sm:pt-8 pb-8">
      <Suspense fallback={loading}>
        <Table gender={gender as Gender} path={path} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Table({
  gender,
  path,
  searchParams,
}: {
  gender: Gender;
  path: string;
  searchParams: PageProps<"/rankings/p4p/[gender]">["searchParams"];
}) {
  const { asOf, latest, past, query } = await tableDay((await searchParams).date);
  const rows = await p4p(gender, past);
  return (
    <>
      <h1 className="sr-only">{GENDERS[gender]} pound for pound — judo ranking</h1>
      <WeightSwitcher current={path} query={query} />
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
