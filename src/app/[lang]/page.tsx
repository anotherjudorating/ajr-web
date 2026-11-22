import type { Metadata } from "next";
import Link from "@/components/Link";
import { Suspense } from "react";

import { Flag } from "@/components/Flag";
import { HomeAthlete } from "@/components/home/HomeAthlete";
import { LeaderPanel } from "@/components/home/LeaderPanel";
import { RowChevron } from "@/components/Icon";
import { H2, LINK } from "@/components/tournament/styles";
import { UpsetCard } from "@/components/UpsetCard";
import { biggestMovers, homeLeaders, recentUpsets, upcoming } from "@/lib/api";
import { shortCompetition } from "@/lib/format";
import { LangJump } from "@/components/LangJump";
import { alternatesFor, SITE } from "@/lib/seo";
import { MEN, WOMEN } from "@/lib/weights";
import { i18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, d } = await i18n();
  return {
    title: d.home.title,
    description: d.home.description,
    alternates: alternatesFor(lang, "/"),
  };
}

const HEAD = "flex items-baseline justify-between border-b-2 border-ink pb-2";

// The home page, as in the prototype (index.html): the question, the leaders of
// every weight, the biggest movers, the month's upsets and the coming tournaments.
export default async function Home() {
  const { d } = await i18n();
  // The site's name, which Google writes over the address in its results (the titles
  // do not repeat it: app/layout.tsx).
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: d.site.name, url: `${SITE}/` };
  return (
    <div className="w-full bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <LangJump />
      <section className="mb-10 md:mb-12 lg:mb-16">
        <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em] text-ink mb-2">
          {d.home.question}
        </h1>
        <p className="text-[16px] text-muted max-w-3xl leading-relaxed">
          {d.home.lead}{" "}
          <Link href="/methodology" className="font-serif font-semibold text-claret hover:underline whitespace-nowrap">
            {d.home.howItWorks}
          </Link>
        </p>
      </section>
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <HomeLists />
      </Suspense>
    </div>
  );
}

// The side lists are extras: one that fails is left empty rather than the page.
const orNothing = <T,>(list: Promise<T[]>) => list.catch((error) => (console.error(error), [] as T[]));

async function HomeLists() {
  const [leaders, movers, upsets, coming, { d, f }] = await Promise.all([
    homeLeaders(),
    orNothing(biggestMovers()),
    orNothing(recentUpsets()),
    orNothing(upcoming()),
    i18n(),
  ]);
  return (
    <>
      <section className="mb-14 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-24 gap-y-14">
          <LeaderPanel title={d.common.gender.men} weights={MEN} rows={leaders} p4p={{ href: "/rankings/p4p/men", label: d.home.leaders.p4pMen }} />
          <LeaderPanel title={d.common.gender.women} weights={WOMEN} rows={leaders} p4p={{ href: "/rankings/p4p/women", label: d.home.leaders.p4pWomen }} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-14 md:gap-x-16 xl:gap-x-24">
        <div className="flex flex-col">
          <div className={HEAD}>
            <h2 className={H2}>{d.home.movers.title}</h2>
            <span className="text-[10px] text-muted uppercase">{d.home.movers.period}</span>
          </div>
          <div>
            {movers.map((row) => (
              <HomeAthlete key={row.athlete_id} row={row} />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className={HEAD}>
            <h2 className={H2}>{d.home.upsets.title}</h2>
            <Link href="/explore/contests?result=upsets&sort=chance-asc" className={LINK}>
              {d.home.upsets.all}
            </Link>
          </div>
          <div className="flex flex-col text-[14px]">
            {upsets.map((u) => (
              <UpsetCard
                key={u.contest_id}
                href={`/contests/${u.contest_id}`}
                winner={{ family: u.winner_family_name, country: u.winner_country, chance: u.winner_chance, score: u.winner_score }}
                loser={{ family: u.loser_family_name, country: u.loser_country, chance: 1 - u.winner_chance, score: u.loser_score }}
                where={shortCompetition(u.competition).replace(/\s\d{4}$/, "")}
                round={u.round}
              />
            ))}
            {upsets.length === 0 && <p className="py-4 text-[14px] text-muted">{d.home.upsets.none}</p>}
          </div>
        </div>

        <div className="flex flex-col md:col-span-2 xl:col-span-1">
          <div className={HEAD}>
            <h2 className={H2}>{d.home.upcoming.title}</h2>
            <Link href="/explore/tournaments" className={LINK}>
              {d.home.upcoming.all}
            </Link>
          </div>
          <div className="flex flex-col">
            {coming.map((t) => (
              <Link
                key={t.id}
                href={`/tournaments/${t.id}`}
                className="h-10 sm:h-11 py-0 px-1 border-b border-rule flex items-center justify-between text-[13px] sm:text-[14px] hover:bg-panel/40 transition-colors group"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Flag ioc={t.country} />
                  <span className="font-medium text-ink truncate">{t.name.replace(/\s\d{4}$/, "")}</span>
                </div>
                <div className="flex items-center shrink-0">
                  <span className="text-muted tabular-nums whitespace-nowrap text-right">{f.dateRange(t.date_from, t.date_to)}</span>
                  <span className="w-8 sm:w-10 sm:pr-[3px] flex justify-end items-center text-muted">
                    <RowChevron />
                  </span>
                </div>
              </Link>
            ))}
            {coming.length === 0 && <p className="py-4 text-[14px] text-muted">{d.home.upcoming.none}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
