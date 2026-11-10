import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CountryView } from "@/components/country/CountryView";
import { country, countryLeaders, countryTournaments, lastUpdate, nations } from "@/lib/api";
import { nationWeeks } from "@/lib/tables";

// /countries/jpn: the IOC code, in lower case as in the prototype's links.
const codeOf = (ioc: string) => (/^[a-z]{3}$/i.test(ioc) ? ioc.toUpperCase() : null);

// One nation is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  const all = await nations();
  return [...all].sort((a, b) => b.athletes - a.athletes).slice(0, 1).map((n) => ({ ioc: n.country.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<"/countries/[ioc]">): Promise<Metadata> {
  const code = codeOf((await params).ioc);
  const found = code ? await country(code) : null;
  if (!found) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  return {
    title: `${found.name} — judo nation rating, best athletes by weight`,
    description: `${found.name} in judo: its place among the nations, its strongest judoka in every weight, its tournaments and medals, by Glicko-2 rating.`,
  };
}

export default function CountryPage({ params }: PageProps<"/countries/[ioc]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <CountryContent params={params} />
      </Suspense>
    </div>
  );
}

async function CountryContent({ params }: { params: PageProps<"/countries/[ioc]">["params"] }) {
  const code = codeOf((await params).ioc);
  if (!code) notFound();
  const [found, leaders, history, tournaments, updated] = await Promise.all([
    country(code),
    countryLeaders(code),
    nationWeeks(code),
    countryTournaments(code),
    lastUpdate(),
  ]);
  if (!found) notFound();
  return (
    <CountryView
      country={found}
      leaders={leaders}
      history={history}
      tournaments={tournaments}
      today={(updated ?? "1970-01-01").slice(0, 10)}
    />
  );
}
