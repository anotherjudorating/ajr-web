import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TeamsBrowser } from "@/components/rankings/TeamsBrowser";
import { WeightSwitcher } from "@/components/WeightSwitcher";
import { teams } from "@/lib/api";
import { tableDay } from "@/lib/days";

const KINDS = { men: "Men", women: "Women", mixed: "Mixed" } as const;
type Kind = keyof typeof KINDS;

export function generateStaticParams() {
  return Object.keys(KINDS).map((kind) => ({ kind }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/teams/[kind]">): Promise<Metadata> {
  const { kind } = await params;
  return kind in KINDS ? { title: `${KINDS[kind as Kind]} nations — judo team ranking` } : {};
}

export default async function Page({ params, searchParams }: PageProps<"/rankings/teams/[kind]">) {
  const { kind } = await params;
  if (!(kind in KINDS)) notFound();
  const path = `/rankings/teams/${kind}`;
  const weights = kind === "mixed" ? 14 : 7;

  // while the table loads, the switcher, the toolbar and the table's header stay
  const loading = (
    <>
      <WeightSwitcher current={path} />
      <TeamsBrowser loading rows={[]} weights={weights} asOf="" latest="" path={path} csvName="" />
    </>
  );

  return (
    <div className="w-full bg-paper pt-6 sm:pt-8 pb-8">
      <Suspense fallback={loading}>
        <Table kind={kind as Kind} weights={weights} path={path} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Table({
  kind,
  weights,
  path,
  searchParams,
}: {
  kind: Kind;
  weights: number;
  path: string;
  searchParams: PageProps<"/rankings/teams/[kind]">["searchParams"];
}) {
  const { asOf, latest, past, query } = await tableDay((await searchParams).date);
  const rows = await teams(kind, past);
  return (
    <>
      <h1 className="sr-only">{KINDS[kind]} nations — judo team ranking</h1>
      <WeightSwitcher current={path} query={query} />
      <TeamsBrowser
        key={asOf}
        rows={rows}
        weights={weights}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-teams-${kind}-${asOf}.csv`}
      />
    </>
  );
}
