import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CountryView } from "@/components/country/CountryView";
import { country, countryHistory, countryLeaders, countryTournaments, lastUpdate } from "@/lib/api";

// /countries/jpn: the IOC code, in lower case as in the prototype's links.
const codeOf = (ioc: string) => (/^[a-z]{3}$/i.test(ioc) ? ioc.toUpperCase() : null);

export async function generateMetadata({ params }: PageProps<"/countries/[ioc]">): Promise<Metadata> {
  const code = codeOf((await params).ioc);
  const found = code ? await country(code) : null;
  return found ? { title: `${found.name} — judo nation rating` } : {};
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
    countryHistory(code),
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
      today={(updated ?? new Date().toISOString()).slice(0, 10)}
    />
  );
}
