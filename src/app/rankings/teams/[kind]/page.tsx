import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TeamsBrowser } from "@/components/rankings/TeamsBrowser";
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

export default function Page({ params, searchParams }: PageProps<"/rankings/teams/[kind]">) {
  // the URL is read inside the Suspense, so the page's shell is static and a move
  // between tables is instant; meanwhile the toolbar and the table's header show
  return (
    <Suspense fallback={<TeamsBrowser loading rows={[]} weights={7} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Table({ params, searchParams }: PageProps<"/rankings/teams/[kind]">) {
  const { kind } = await params;
  if (!(kind in KINDS)) notFound();
  const path = `/rankings/teams/${kind}`;
  const { asOf, latest, past } = await tableDay((await searchParams).date);
  const rows = await teams(kind, past);
  return (
    <>
      <h1 className="sr-only">{KINDS[kind as Kind]} nations — judo team ranking</h1>
      <TeamsBrowser
        key={asOf}
        rows={rows}
        weights={kind === "mixed" ? 14 : 7}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-teams-${kind}-${asOf}.csv`}
      />
    </>
  );
}
