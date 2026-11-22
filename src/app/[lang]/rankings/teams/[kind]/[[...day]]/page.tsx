import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { TeamsBrowser } from "@/components/rankings/TeamsBrowser";
import { teams } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { formatDate } from "@/lib/format";
import { NOINDEX } from "@/lib/seo";

const KINDS = { men: "Men", women: "Women", mixed: "Mixed" } as const;
type Kind = keyof typeof KINDS;
const WHO: Record<Kind, string> = { men: "men", women: "women", mixed: "men and women" };

export function generateStaticParams() {
  return Object.keys(KINDS).map((kind) => ({ kind, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/teams/[kind]/[[...day]]">): Promise<Metadata> {
  const { kind, day } = await params;
  if (!(kind in KINDS)) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const title = `Judo nations ranking, ${WHO[kind as Kind]}`;
  const { past } = await tableDay(day);
  const top = (await teams(kind, past)).slice(0, 3).map((r) => `${r.place}. ${r.country_name ?? r.country}`).join(", ");
  const description = `Which country has the strongest judo team: each nation rated by its best athlete in every weight.${top ? ` ${top}.` : ""}`;
  return past
    ? { title: `${title} on ${formatDate(past)}`, description, robots: NOINDEX } // a past day
    : { title, description };
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
      <h1 className="sr-only">Judo nations ranking, {WHO[kind as Kind]}</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: "Rankings" }]} current={`${KINDS[kind as Kind]} nations`} />
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
