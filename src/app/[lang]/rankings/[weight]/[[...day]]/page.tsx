import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { RankingsBrowser } from "@/components/rankings/RankingsBrowser";
import { countryNames, leaderboard } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";
import { formatDate } from "@/lib/format";
import { NOINDEX, podium } from "@/lib/seo";

// All 14 tables are rendered ahead of time and refreshed with the data (next.config.ts).
export function generateStaticParams() {
  return WEIGHTS.map((w) => ({ weight: w.slug, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/[weight]/[[...day]]">): Promise<Metadata> {
  const { weight: slug, day } = await params;
  const weight = weightBySlug(slug);
  if (!weight) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const title = `${weightTitle(weight)} judo world ranking`;
  const { past } = await tableDay(day);
  const leaders = podium(await leaderboard(weight.api, past));
  const strongest = `The strongest ${weightTitle(weight).toLowerCase()} judoka${past ? ` on ${formatDate(past)}` : ""}`;
  const description = leaders ? `${strongest}: ${leaders}.` : `${strongest}.`;
  return past
    ? { title: `${title} on ${formatDate(past)}`, description, robots: NOINDEX } // a past day
    : { title, description };
}

// The rows sent with the page: the first page of the table (the whole of it, ~600 rows,
// was ~500 KB of HTML); the rest is fetched when the reader goes past them, filters,
// sorts or exports (/api/leaderboard).
const FIRST_ROWS = 50;

export default function RankingsPage({ params }: PageProps<"/rankings/[weight]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<RankingsBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Rankings params={params} />
    </Suspense>
  );
}

async function Rankings({ params }: { params: PageProps<"/rankings/[weight]/[[...day]]">["params"] }) {
  const { weight: slug, day } = await params;
  const weight = weightBySlug(slug);
  if (!weight) notFound();
  const { asOf, latest, past } = await tableDay(day);
  const rows = await leaderboard(weight.api, past);
  const names = await countryNames(rows.map((r) => r.country));
  const path = `/rankings/${weight.slug}`;

  return (
    <>
      <h1 className="sr-only">{weightTitle(weight)} judo world ranking</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: "Rankings" }]} current={weightTitle(weight)} />
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
