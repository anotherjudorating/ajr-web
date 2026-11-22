import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { TeamsBrowser } from "@/components/rankings/TeamsBrowser";
import { teams } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { alternatesFor, NOINDEX } from "@/lib/seo";
import { i18n } from "@/i18n/server";

const KINDS = ["men", "women", "mixed"] as const;
type Kind = (typeof KINDS)[number];
const isKind = (value: string): value is Kind => (KINDS as readonly string[]).includes(value);

export function generateStaticParams() {
  return KINDS.map((kind) => ({ kind, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rankings/teams/[kind]/[[...day]]">): Promise<Metadata> {
  const { kind, day } = await params;
  if (!isKind(kind)) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const { lang, d, f, t } = await i18n();
  const title = t(d.rankings.nations.title, { who: d.rankings.nations.who[kind] });
  const { past } = await tableDay(day);
  const top = (await teams(kind, past)).slice(0, 3).map((r) => `${r.place}. ${r.country_name ?? r.country}`).join(", ");
  const description = top ? t(d.rankings.nations.descriptionTop, { description: d.rankings.nations.description, top }) : d.rankings.nations.description;
  return past
    ? { title: t(d.rankings.pastTitle, { title, date: f.formatDate(past) }), description, alternates: alternatesFor(lang, `/rankings/teams/${kind}/${(day ?? []).join("/")}`, { indexed: false }), robots: NOINDEX } // a past day
    : { title, description, alternates: alternatesFor(lang, `/rankings/teams/${kind}`) };
}

export default function Page({ params }: PageProps<"/[lang]/rankings/teams/[kind]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<TeamsBrowser loading rows={[]} weights={7} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} />
    </Suspense>
  );
}

async function Table({ params }: { params: PageProps<"/[lang]/rankings/teams/[kind]/[[...day]]">["params"] }) {
  const { kind, day } = await params;
  if (!isKind(kind)) notFound();
  const { d, t } = await i18n();
  const path = `/rankings/teams/${kind}`;
  const { asOf, latest, past } = await tableDay(day);
  const rows = await teams(kind, past);
  return (
    <>
      <h1 className="sr-only">{t(d.rankings.nations.title, { who: d.rankings.nations.who[kind] })}</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: d.rankings.breadcrumb }]} current={t(d.rankings.nations.breadcrumb, { gender: d.common.gender[kind] })} />
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
