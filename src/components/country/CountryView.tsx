import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Leaders } from "@/components/country/Leaders";
import { NationChart } from "@/components/country/NationChart";
import { Tournaments } from "@/components/country/Tournaments";
import { Flag } from "@/components/Flag";
import type { Country, CountryLeader, CountryTournament, CountryWeek } from "@/lib/api";
import { CONTINENTS } from "@/lib/continents";
import { signed } from "@/lib/format";
import { MEN, WOMEN } from "@/lib/weights";

const LABEL = "text-[12px] uppercase tracking-wider text-muted font-semibold";
const DIVIDER = <span className="inline-block w-px h-3 bg-rule mx-3 align-middle" />;

// A nation, as in the prototype (country.html): its places in the nations rankings
// and its rating, how that went, its best athlete in every weight and its latest
// tournaments.
export function CountryView({
  country: c,
  leaders,
  history,
  tournaments,
  today,
}: {
  country: Country;
  leaders: CountryLeader[];
  history: CountryWeek[];
  tournaments: CountryTournament[];
  today: string;
}) {
  const changes = [
    { label: "90 days", rating: c.rating_90d, place: c.place_90d },
    { label: "6 months", rating: c.rating_6m, place: c.place_6m },
  ];

  return (
    <>
      <Breadcrumbs
        className="pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px]"
        trail={[
          { href: "/explore/tournaments", label: "Explore" },
          { href: "/explore/nations", label: "Nations" },
        ]}
        current={c.name}
      />
      <header className="mt-3 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-6">
        <div className="flex flex-col">
          <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em] flex items-center gap-3">
            <Flag ioc={c.country} className="!w-8 !h-6" />
            {c.name}
          </h1>
          <div className="mt-1.5 flex items-center text-[14px] text-muted">
            {CONTINENTS[c.country] && (
              <>
                <span>{CONTINENTS[c.country]}</span>
                {DIVIDER}
              </>
            )}
            <Link href={`/explore/athletes?country=${c.country}`} className="hover:text-ink hover:underline">
              {c.athletes} rated athletes
            </Link>
          </div>
        </div>

        {c.rating !== null && (
          <div className="w-full md:w-[460px] max-w-[460px] md:ml-auto self-start">
            <div className="flex justify-between items-start gap-2 sm:gap-4">
              {[
                { label: "Rank", title: "Nations ranking, mixed", place: c.place },
                { label: "Men", title: "Nations ranking, men", place: c.place_men },
                { label: "Women", title: "Nations ranking, women", place: c.place_women },
              ].map(({ label, title, place }) => (
                <div key={label} className="flex flex-col" title={title}>
                  <span className={LABEL}>{label}</span>
                  <span className="font-serif mt-1 text-[28px] leading-tight font-bold tabular-nums">
                    {place === null ? "—" : `#${place}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between items-end gap-4">
              <div className="flex flex-col">
                <div className="font-serif text-[56px] leading-none font-bold tabular-nums">{c.rating}</div>
                <span className={`${LABEL} mt-2`}>Leaders rating avg</span>
              </div>
              <div className="tabular-nums text-[12px] pb-1">
                <div className="grid grid-cols-3 gap-4 pb-1 text-[11px] uppercase tracking-wider text-muted font-semibold text-right">
                  <span className="text-left">Change</span>
                  <span>Rating</span>
                  <span>Rank</span>
                </div>
                {changes.map(({ label, rating, place }) => {
                  const gain = rating === null ? null : c.rating! - rating;
                  const up = place === null || c.place === null ? 0 : place - c.place;
                  return (
                    <div key={label} className="grid grid-cols-3 gap-4 py-0.5 items-center text-right">
                      <span className="text-muted text-left">{label}</span>
                      <span className={`font-bold text-[14px] ${gain === null ? "text-muted" : gain >= 0 ? "text-gain" : "text-drop"}`}>
                        {gain === null ? "–" : signed(gain)}
                      </span>
                      <span className={`font-medium text-[14px] ${up > 0 ? "text-gain" : up < 0 ? "text-drop" : "text-muted"}`}>
                        {up > 0 ? `↑${up}` : up < 0 ? `↓${-up}` : "–"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-rule flex flex-wrap justify-between items-center text-[12px] gap-2">
              <div className="inline-flex items-center gap-1.5 text-muted">
                <span>Top 1</span>
                <span className="tabular-nums font-semibold text-ink">{c.top1}</span>
                {DIVIDER}
                <span>Top 8 avg</span>
                <span className="tabular-nums font-semibold text-ink">{c.top8}</span>
              </div>
              <Link href="/rankings/teams/mixed" className="font-serif text-[14px] font-semibold text-claret hover:underline">
                Nations ranking
              </Link>
            </div>
          </div>
        )}
      </header>

      {c.rating !== null && <NationChart ioc={c.country} history={history} today={today} rating={c.rating} />}

      <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">
        <Leaders title="Men leaders" weights={MEN} leaders={leaders} href={`/explore/athletes?country=${c.country}&weight=men`} />
        <Leaders title="Women leaders" weights={WOMEN} leaders={leaders} href={`/explore/athletes?country=${c.country}&weight=women`} />
      </div>
      <div className="mt-14 lg:mt-16">
        <Tournaments rows={tournaments} ioc={c.country} />
      </div>
    </>
  );
}
