import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BreadcrumbData } from "@/components/Breadcrumbs";
import { P4PBrowser } from "@/components/rankings/P4PBrowser";
import { countryNames, p4p } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { alternatesFor, NOINDEX } from "@/lib/seo";
import { i18n } from "@/i18n/server";

const GENDERS = ["men", "women"] as const;
type Gender = (typeof GENDERS)[number];
const isGender = (value: string): value is Gender => (GENDERS as readonly string[]).includes(value);

export function generateStaticParams() {
  return GENDERS.map((gender) => ({ gender, day: [] }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/rankings/p4p/[gender]/[[...day]]">): Promise<Metadata> {
  const { gender, day } = await params;
  if (!isGender(gender)) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const { lang, d, f, t } = await i18n();
  const title = t(d.rankings.p4p.title, { gender: d.common.gender[gender] });
  const description = t(d.rankings.p4p.description, { gender: d.common.gender[gender].toLowerCase() });
  return day?.length
    ? { title: t(d.rankings.pastTitle, { title, date: f.formatDate(day[0]) }), description, alternates: alternatesFor(lang, `/rankings/p4p/${gender}/${day.join("/")}`, { indexed: false }), robots: NOINDEX } // a past day
    : { title, description, alternates: alternatesFor(lang, `/rankings/p4p/${gender}`) };
}

export default function Page({ params }: PageProps<"/[lang]/rankings/p4p/[gender]/[[...day]]">) {
  // today's table (no day in the path) is built ahead and refreshed with the data;
  // a past day's on its first visit. The params are read inside the Suspense, so
  // the shell is static and a move between tables is instant.
  return (
    <Suspense fallback={<P4PBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Table params={params} />
    </Suspense>
  );
}

async function Table({ params }: { params: PageProps<"/[lang]/rankings/p4p/[gender]/[[...day]]">["params"] }) {
  const { gender, day } = await params;
  if (!isGender(gender)) notFound();
  const { d, t } = await i18n();
  const path = `/rankings/p4p/${gender}`;
  const { asOf, latest, past } = await tableDay(day);
  const rows = await p4p(gender, past);
  const names = await countryNames(rows.map((r) => r.country));
  return (
    <>
      <h1 className="sr-only">{t(d.rankings.p4p.title, { gender: d.common.gender[gender] })}</h1>
      <BreadcrumbData trail={[{ href: "/rankings", label: d.rankings.breadcrumb }]} current={t(d.rankings.p4p.breadcrumb, { gender: d.common.gender[gender] })} />
      <P4PBrowser
        key={asOf}
        rows={rows}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-p4p-${gender}-${asOf}.csv`}
        countryNames={names}
      />
    </>
  );
}
