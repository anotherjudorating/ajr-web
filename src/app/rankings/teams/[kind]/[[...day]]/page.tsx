import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { TeamsBrowser } from "@/components/rankings/TeamsBrowser";
import { teams } from "@/lib/api";
import { tableDay } from "@/lib/days";

const KINDS = { men: "Men", women: "Women", mixed: "Mixed" } as const;
type Kind = keyof typeof KINDS;

export function generateStaticParams() {
  return Object.keys(KINDS).map((kind) => ({ kind, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/teams/[kind]/[[...day]]">): Promise<Metadata> {
  const { kind } = await params;
  return kind in KINDS ? { title: `${KINDS[kind as Kind]} nations — judo team ranking` } : {};
}

export default function Page({ params }: PageProps<"/rankings/teams/[kind]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<TeamsBrowser loading rows={[]} weights={7} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} />
    </Suspense>
  );
}

async function Table({ params }: { params: PageProps<"/rankings/teams/[kind]/[[...day]]">["params"] }) {
  const { kind, day } = await params;
  if (!(kind in KINDS)) notFound();
  const path = `/rankings/teams/${kind}`;
  const { asOf, latest, past } = await tableDay(day);
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
