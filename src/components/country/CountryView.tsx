import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NationChart } from "@/components/country/NationChart";
import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD, HEAD_CELL, LINK, ROW_CELL } from "@/components/tournament/styles";
import type { Country, CountryLeader, CountryTournament, CountryWeek } from "@/lib/api";
import { shortCompetition, shortDate, shortName, signed } from "@/lib/format";
import { MEN, type Weight, WOMEN } from "@/lib/weights";

const LABEL = "text-[12px] uppercase tracking-wider text-muted font-semibold";
const DIVIDER = <span className="inline-block w-px h-3 bg-rule mx-3 align-middle" />;
const KINDS: MedalKind[] = ["gold", "silver", "bronze"];

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

      {c.rating !== null && <NationChart history={history} today={today} rating={c.rating} />}

      <div className="mt-14 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-24">
        <Leaders title="Men leaders" weights={MEN} leaders={leaders} href={`/explore/athletes?country=${c.country}&weight=men`} />
        <Leaders title="Women leaders" weights={WOMEN} leaders={leaders} href={`/explore/athletes?country=${c.country}&weight=women`} />
        <Tournaments rows={tournaments} />
      </div>
    </>
  );
}

// Its best athlete in every weight of a gender and their place in the weight.
function Leaders({ title, weights, leaders, href }: { title: string; weights: Weight[]; leaders: CountryLeader[]; href: string }) {
  const rows = weights
    .map((weight) => ({ weight, leader: leaders.find((l) => l.weight === weight.api) }))
    .filter((row) => row.leader !== undefined);
  if (rows.length === 0) return null;
  return (
    <section>
      <div className={HEAD}>
        <h2 className={H2}>{title}</h2>
        <Link href={href} className={LINK}>
          All athletes
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left w-14 sm:w-16`}>Weight</th>
            <th className={`${HEAD_CELL} text-left`}>Athlete</th>
            <th className={`${HEAD_CELL} text-right w-16`} title="World rank in the weight">
              Rank
            </th>
            <th className={`${HEAD_CELL} text-right w-16 sm:w-20`}>Rating</th>
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ weight, leader }) => (
            <RowLink key={weight.slug} href={`/athletes/${leader!.athlete_id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={`${ROW_CELL} text-muted`}>{weight.label}</td>
              <td className={ROW_CELL}>
                <span className="font-medium truncate block">{shortName(leader!.family_name, leader!.given_name)}</span>
              </td>
              <td className={`${ROW_CELL} text-right ${leader!.place === 1 ? "font-semibold" : "text-muted"}`}>#{leader!.place}</td>
              <td className={`${ROW_CELL} text-right font-bold`}>{leader!.score}</td>
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// The latest tournaments its athletes fought at, with their medals.
function Tournaments({ rows }: { rows: CountryTournament[] }) {
  if (rows.length === 0) return null;
  return (
    <section>
      <div className={HEAD}>
        <h2 className={H2}>Recent tournaments</h2>
        <Link href="/explore/tournaments" className={LINK}>
          All tournaments
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Tournament</th>
            <th className={`${HEAD_CELL} text-left w-20 hidden sm:table-cell`}>Date</th>
            {KINDS.map((kind) => (
              <th key={kind} className={`${HEAD_CELL} text-center w-11 sm:w-14`} title={kind}>
                <span className="inline-flex justify-center w-full">
                  <Medal kind={kind} />
                </span>
              </th>
            ))}
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <RowLink key={t.id} href={`/tournaments/${t.id}`} className="border-b border-rule hover:bg-panel/40">
              <td className={ROW_CELL}>
                <span className="font-medium truncate block">{shortCompetition(t.name)}</span>
              </td>
              <td className={`${ROW_CELL} text-muted whitespace-nowrap hidden sm:table-cell`}>{shortDate(t.date_from)}</td>
              {KINDS.map((kind) => (
                <td key={kind} className={`${ROW_CELL} text-center`}>
                  {t[kind]}
                </td>
              ))}
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
    </section>
  );
}
