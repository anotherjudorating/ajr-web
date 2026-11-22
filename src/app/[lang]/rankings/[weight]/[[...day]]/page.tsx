import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { RankingsBrowser } from "@/components/rankings/RankingsBrowser";
import { countryNames, leaderboard } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { WEIGHTS, weightBySlug } from "@/lib/weights";
import { alternatesFor, NOINDEX, podium } from "@/lib/seo";
import { i18n } from "@/i18n/server";

// All 14 tables are rendered ahead of time and refreshed with the data (next.config.ts).
export function generateStaticParams() {
  return WEIGHTS.map((w) => ({ weight: w.slug, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rankings/[weight]/[[...day]]">): Promise<Metadata> {
  const { weight: slug, day } = await params;
  const weight = weightBySlug(slug);
  if (!weight) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const { lang, d, f, t } = await i18n();
  const title = t(d.rankings.weight.title, { weight: f.weightTitle(weight) });
  const { past } = await tableDay(day);
  const leaders = podium(await leaderboard(weight.api, past));
  const lower = f.weightTitle(weight).toLowerCase();
  const strongest = past ? t(d.rankings.weight.strongestOn, { weight: lower, date: f.formatDate(past) }) : t(d.rankings.weight.strongest, { weight: lower });
  const description = leaders ? t(d.rankings.weight.description, { strongest, leaders }) : t(d.rankings.weight.descriptionShort, { strongest });
  return past
    ? { title: t(d.rankings.pastTitle, { title, date: f.formatDate(past) }), description, alternates: alternatesFor(lang, `/rankings/${slug}/${(day ?? []).join("/")}`, { indexed: false }), robots: NOINDEX } // a past day
    : { title, description, alternates: alternatesFor(lang, `/rankings/${slug}`) };
}

// The rows sent with the page: the first page of the table (the whole of it, ~600 rows,
// was ~500 KB of HTML); the rest is fetched when the reader goes past them, filters,
// sorts or exports (/api/leaderboard).
const FIRST_ROWS = 50;

export default function RankingsPage({ params }: PageProps<"/[lang]/rankings/[weight]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<RankingsBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Rankings params={params} />
    </Suspense>
  );
}

async function Rankings({ params }: { params: PageProps<"/[lang]/rankings/[weight]/[[...day]]">["params"] }) {
  const { weight: slug, day } = await params;
  const weight = weightBySlug(slug);
  if (!weight) notFound();
  const { d, f, t } = await i18n();
  const { asOf, latest, past } = await tableDay(day);
  const rows = await leaderboard(weight.api, past);
  const names = await countryNames(rows.map((r) => r.country));
  const path = `/rankings/${weight.slug}`;

  return (
    <>
      <h1 className="sr-only">{t(d.rankings.weight.title, { weight: f.weightTitle(weight) })}</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: d.rankings.breadcrumb }]} current={f.weightTitle(weight)} />
      <RankingsBrowser
        key={`${path}-${asOf}`}
        rows={rows.slice(0, FIRST_ROWS)}
        total={rows.length}
        full={`/api/leaderboard?weight=${encodeURIComponent(weight.api)}${past ? `&day=${past}` : ""}`}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-${weight.slug}-${asOf}.csv`}
        countryNames={names}
      />
    </>
  );
}
