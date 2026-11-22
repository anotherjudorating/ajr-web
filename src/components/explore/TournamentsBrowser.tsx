"use client";

import { useRouter } from "@/i18n/navigation";
import { Fragment, useMemo, useState } from "react";

import { CsvButton, ExploreTitle, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { Flag } from "@/components/Flag";
import { CHEVRON_CELL, Icon, RowChevron } from "@/components/Icon";
import { HEAD_CELL, PlaceholderRows, ROW_CELL, saveCsv } from "@/components/rankings/TableParts";
import { useI18n } from "@/i18n/client";
import type { CompetitionRow } from "@/lib/api";
import { shortCompetition } from "@/lib/format";

// The levels: the value is the backend's rank name (or "continental" for the rest),
// the key names it in the dictionary (d.explore.tournaments.levels).
const LEVELS = [
  { value: "", key: "all" },
  { value: "Olympic Games", key: "olympics" },
  { value: "World Championships", key: "worlds" },
  { value: "Masters", key: "masters" },
  { value: "Grand Slam", key: "grandSlam" },
  { value: "Grand Prix", key: "grandPrix" },
  { value: "continental", key: "continental" },
] as const;
const WORLD = ["Olympic Games", "World Championships", "Masters", "Grand Slam", "Grand Prix"];
// The sorts, named in the dictionary (d.explore.tournaments.sort).
const SORTS = ["date-desc", "date-asc", "accuracy-desc", "accuracy-asc", "upsets-desc", "upsets-asc"] as const;

// A year's tournaments, grouped by month while sorted by date.
export function TournamentsBrowser({
  rows,
  year,
  latestYear,
  today = "",
  loading = false,
}: {
  rows: CompetitionRow[];
  year: number;
  latestYear: number;
  today?: string; // the day of the latest rating run: a tournament under way, or to come
  loading?: boolean;
}) {
  // not over: no accuracy nor upsets yet (those of a tournament under way change all day)
  const stateOf = (r: CompetitionRow) =>
    r.date_from > today ? "upcoming" : (r.date_to ?? r.date_from) >= today ? "live" : null;
  const { d, f, t, n } = useI18n();
  const x = d.explore.tournaments;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("date-desc"); // the latest first
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (!needle || `${r.name} ${r.city ?? ""} ${r.country_name ?? ""}`.toLowerCase().includes(needle)) &&
        (!level || (level === "continental" ? !WORLD.includes(r.rank_name ?? "") : r.rank_name === level)),
    );
    const [key, direction] = sort.split("-");
    const sign = direction === "asc" ? 1 : -1;
    const value = (r: CompetitionRow) =>
      key === "date" ? r.date_from : key === "accuracy" ? (r.accuracy ?? -1) : (r.upsets ?? -1);
    return [...filtered].sort((a, b) => (value(a) < value(b) ? -sign : value(a) > value(b) ? sign : 0));
  }, [rows, query, level, sort]);

  const byMonth = sort.startsWith("date");
  const month = (r: CompetitionRow) => r.date_from.slice(0, 7);
  const years = Array.from({ length: Math.max(latestYear - 2008, 1) }, (_, i) => latestYear - i);
  const toggle = (key: string) =>
    setClosed((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <>
      <ExploreTitle title={x.title} lead={x.lead} />
      <ToolbarRow>
        <SearchBox value={query} onChange={setQuery} placeholder={x.search} />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select value={level} onChange={setLevel} options={LEVELS.map(({ value, key }) => ({ value, label: x.levels[key] }))} />
          <Select
            value={String(year)}
            onChange={(value) => router.push(`/explore/tournaments?year=${value}`)}
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={sort} onChange={setSort} options={SORTS.map((value) => ({ value, label: x.sort[value] }))} />
          </div>
          <CsvButton onClick={() => downloadCsv(shown, year)} />
        </div>
      </ToolbarRow>

      {/* auto layout: the month rows span all columns, also the ones hidden on phones */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} w-[72px] sm:w-32 text-left`}>{x.columns.dates}</th>
            <th className={`${HEAD_CELL} text-left`}>{x.columns.tournament}</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell text-left`}>{x.columns.location}</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell w-40 text-right`}>{x.columns.accuracy}</th>
            {/* on a phone the name takes the room: upsets on wider screens */}
            <th className={`${HEAD_CELL} hidden sm:table-cell sm:w-24 text-right`}>{x.columns.upsets}</th>
            <th className="w-8 sm:w-10 h-9 py-0" />
          </tr>
        </thead>
        <tbody className="text-[13px] sm:text-[14px]">
          {loading && <PlaceholderRows columns={6} count={10} />}
          {shown.map((row, i) => {
            const opens = byMonth && (i === 0 || month(shown[i - 1]) !== month(row));
            const hidden = byMonth && closed.has(month(row));
            const count = shown.filter((r) => month(r) === month(row)).length;
            return (
              <Fragment key={row.id}>
                {opens && (
                  <tr
                    onClick={() => toggle(month(row))}
                    aria-expanded={!closed.has(month(row))}
                    className="bg-panel cursor-pointer hover:bg-panel/80 select-none"
                  >
                    <td colSpan={6} className="h-8 py-0 align-middle px-2 sm:px-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2">
                          <Icon
                            size={18}
                            name="expand_more"
                            className={`text-muted transition-transform duration-150 ${closed.has(month(row)) ? "-rotate-90" : ""}`}
                          />
                          <span className="text-[12px] font-bold uppercase tracking-wide text-ink">
                            {t(x.monthHeading, { month: x.months[Number(row.date_from.slice(5, 7)) - 1], year: row.date_from.slice(0, 4) })}
                          </span>
                        </span>
                        <span className="text-[12px] text-muted font-normal">
                          {n(d.common.tournaments, count)}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
                {!hidden && (
                  <tr
                    onClick={() => router.push(`/tournaments/${row.id}`)}
                    className="group border-b border-rule hover:bg-panel/40 cursor-pointer"
                  >
                    <td className={`${ROW_CELL} text-muted tabular-nums whitespace-nowrap`}>
                      {f.dateRange(row.date_from, row.date_to)}
                    </td>
                    <td className={`${ROW_CELL} ${stateOf(row) === "upcoming" ? "max-sm:font-normal max-sm:text-muted sm:font-semibold sm:text-ink" : "font-semibold text-ink"}`}>
                      <div className="flex items-center gap-1.5 sm:block">
                        <Flag ioc={row.country} className="sm:!hidden" />
                        <span className="min-w-0 hover:underline line-clamp-2 sm:hidden">
                          {shortCompetition(row.name).replace(/\s\d{4}$/, "")}
                        </span>
                        {/* a phone has no room for the chips on the right: Live after the name,
                            a tournament to come in grey */}
                        {stateOf(row) === "live" && (
                          <span className="sm:hidden shrink-0 flex items-center gap-1 text-[11px] font-semibold text-claret">
                            <span className="w-1.5 h-1.5 rounded-full bg-claret" />
                            {x.live}
                          </span>
                        )}
                        <span className="hover:underline hidden sm:inline">{row.name}</span>
                      </div>
                    </td>
                    <td className={`${ROW_CELL} hidden sm:table-cell text-muted`}>
                      <span className="inline-flex items-center gap-1.5">
                        <Flag ioc={row.country} />
                        {[row.city, row.country].filter(Boolean).join(", ")}
                      </span>
                    </td>
                    {stateOf(row) ? (
                      <td colSpan={2} className={`${ROW_CELL} hidden sm:table-cell text-right`}>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border ${stateOf(row) === "live" ? "border-claret text-claret" : "border-muted text-muted"}`}
                        >
                          {stateOf(row) === "live" && <span className="w-1.5 h-1.5 rounded-full bg-claret" />}
                          {stateOf(row) === "live" ? x.live : x.upcoming}
                        </span>
                      </td>
                    ) : (
                      <>
                        <td
                          className={`${ROW_CELL} hidden sm:table-cell text-right text-ink tabular-nums`}
                          title={t(x.accuracyTip, { contests: row.contests ?? "" })}
                        >
                          {row.accuracy === null ? "–" : `${Math.round(row.accuracy * 100)}%`}
                        </td>
                        <td className={`${ROW_CELL} hidden sm:table-cell text-right text-ink tabular-nums`}>{row.upsets}</td>
                      </>
                    )}
                    <td className={`${CHEVRON_CELL}`}>
                      <RowChevron />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {!loading && shown.length === 0 && <p className="py-6 text-[14px] text-muted">{x.empty}</p>}
    </>
  );
}

function downloadCsv(rows: CompetitionRow[], year: number) {
  const header = ["From", "To", "Tournament", "Level", "City", "Country", "Contests", "Rating accuracy", "Upsets"];
  const lines = rows.map((r) => [
    r.date_from,
    r.date_to ?? "",
    r.name,
    r.rank_name ?? "",
    r.city ?? "",
    r.country ?? "",
    r.contests ?? "",
    r.accuracy === null ? "" : Math.round(r.accuracy * 100),
    r.upsets ?? "",
  ]);
  saveCsv([header, ...lines], `ajr-tournaments-${year}.csv`);
}
