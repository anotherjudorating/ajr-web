import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { RankingsBrowser } from "@/components/rankings/RankingsBrowser";
import { countryNames, leaderboard } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";
import { shortName } from "@/lib/format";
import { NOINDEX } from "@/lib/seo";

// All 14 tables are rendered ahead of time and refreshed with the data (next.config.ts).
export function generateStaticParams() {
  return WEIGHTS.map((w) => ({ weight: w.slug, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/[weight]/[[...day]]">): Promise<Metadata> {
  const { weight: slug, day } = await params;
  const weight = weightBySlug(slug);
  if (!weight) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const title = weightTitle(weight);
  if (day?.length) return { title: `${title} judo ranking on ${day[0]}`, robots: NOINDEX }; // a past day
  const top = (await leaderboard(weight.api)).slice(0, 3);
  const leaders = top.map((r) => `${r.place}. ${shortName(r.family_name, r.given_name)} (${r.country ?? "—"})`).join(", ");
  return {
    title: `${title} — judo world ranking`,
    description: `The strongest ${title} judoka by Glicko-2 rating: ${leaders}. Every IJF contest counts; compared with the IJF World Ranking List.`,
  };
}

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
      <h1 className="sr-only">{weightTitle(weight)} — judo world ranking</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: "Rankings" }]} current={weightTitle(weight)} />
      <RankingsBrowser
        key={`${path}-${asOf}`}
        rows={rows}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-${weight.slug}-${asOf}.csv`}
        countryNames={names}
      />
    </>
  );
}
