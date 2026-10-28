"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { AthletePanel } from "@/components/rankings/AthletePanel";
import { changeText, ijfDifference, placesText } from "@/components/rankings/Changes";
import { Sparkline } from "@/components/rankings/Sparkline";
import { CELL, Pagination, TH, Tip, Toolbar } from "@/components/rankings/TableParts";
import type { LeaderboardRow } from "@/lib/api";
import { fetchAthleteHistory } from "@/lib/browser-api";
import { COUNTRY_NAMES } from "@/lib/countries";
import { competitionCode, fullName, shortDate, shortName, signed } from "@/lib/format";

const SORTS = {
  "rating-desc": "Sort: rating ↓",
  "rating-asc": "Sort: rating ↑",
  "d90-desc": "Sort: +/− 90 days ↓",
  "d90-asc": "Sort: +/− 90 days ↑",
  "d6m-desc": "Sort: +/− 6 months ↓",
  "d6m-asc": "Sort: +/− 6 months ↑",
} as const;
type Sort = keyof typeof SORTS;

const COLUMNS = 14;


function sortRows(rows: LeaderboardRow[], sort: Sort): LeaderboardRow[] {
  const [key, direction] = sort.split("-") as ["rating" | "d90" | "d6m", "asc" | "desc"];
  const value = (row: LeaderboardRow) =>
    key === "rating" ? -row.place : key === "d90" ? row.score_change_90d : row.score_change_6m;
  return [...rows].sort((a, b) => {
    const x = value(a);
    const y = value(b);
    if (x === null && y === null) return a.place - b.place;
    if (x === null) return 1; // no change: always at the end
    if (y === null) return -1;
    return direction === "desc" ? y - x : x - y;
  });
}

// The columns on screen (narrow screens hide some). An expanded row must span exactly
// these: in a fixed table, a colSpan over hidden columns adds empty ones that squeeze
// the athlete's name.
function useVisibleColumns() {
  const header = useRef<HTMLTableRowElement>(null);
  const [count, setCount] = useState(COLUMNS);
  useEffect(() => {
    const measure = () => {
      const cells = [...(header.current?.children ?? [])];
      setCount(cells.filter((cell) => getComputedStyle(cell).display !== "none").length || COLUMNS);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return [header, count] as const;
}

function downloadCsv(rows: LeaderboardRow[], asOf: string, fileName: string) {
  const year = new Date(asOf).getUTCFullYear();
  const header = ["Place", "Athlete", "Country", "Rating", "+/- 90 days", "Places 6 months", "+/- 6 months", "IJF", "Age", "Last tournament", "Last contest"];
  const lines = rows.map((r) => [
    r.place,
    `${r.family_name} ${r.given_name ?? ""}`.trim(),
    r.country ?? "",
    r.score,
    r.score_change_90d ?? "",
    r.places_up_6m ?? "",
    r.score_change_6m ?? "",
    r.wrl_place ?? "",
    r.birth_year ? year - r.birth_year : "",
    r.last_competition_name ?? "",
    r.last_contest,
  ]);
  const csv = [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function RankingsBrowser({
  rows,
  asOf,
  latest,
  path,
  csvName,
  loading = false,
}: {
  rows: LeaderboardRow[];
  asOf: string; // the day of the table, YYYY-MM-DD
  latest: string; // the newest day there is data for
  path: string; // e.g. /rankings/men-73
  csvName: string;
  loading?: boolean; // the table is on its way: show the page around it, rows as placeholders
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState<Sort>("rating-desc");
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [headerRow, visibleColumns] = useVisibleColumns();

  // the countries in this table, by full name
  const countries = useMemo(
    () =>
      [...new Set(rows.map((r) => r.country).filter((c): c is string => !!c))]
        .map((code) => ({ code, name: COUNTRY_NAMES[code] ?? code }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [rows],
  );
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (!country || r.country === country) &&
        (!needle || `${r.family_name ?? ""} ${r.given_name ?? ""}`.toLowerCase().includes(needle)),
    );
    return sortRows(filtered, sort);
  }, [rows, query, country, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pages);
  const first = (currentPage - 1) * pageSize;
  const pageRows = shown.slice(first, first + pageSize);
  const year = new Date(asOf).getUTCFullYear();

  const toggle = (id: number) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const setDay = (day: string) => {
    router.push(day >= latest ? path : `${path}?date=${day}`);
  };

  return (
    <>
      <Toolbar
        query={query}
        onQuery={(value) => {
          setQuery(value);
          setPage(1);
        }}
        countries={countries}
        country={country}
        onCountry={(value) => {
          setCountry(value);
          setPage(1);
        }}
        asOf={asOf}
        latest={latest}
        onDay={setDay}
        sorts={SORTS}
        sort={sort}
        onSort={setSort}
        onCsv={() => downloadCsv(shown, asOf, csvName)}
      />

      {/* table */}
      <div className="w-full border-b border-rule bg-paper">
        <table className="rk-table w-full table-fixed border-collapse text-left">
          <thead>
            <tr ref={headerRow} className="bg-panel border-b border-rule">
              <th className={`${TH} w-9 sm:w-12 px-1 text-right tabular-nums whitespace-nowrap`}>#</th>
              <th className={`${TH} w-10 sm:w-14 px-1 text-center tabular-nums whitespace-nowrap relative group cursor-help`}>
                <span>↑↓</span>
                <Tip center>Rank change, last 90 days</Tip>
              </th>
              <th className={`${TH} text-left truncate`}>Athlete</th>
              <th className={`${TH} hidden sm:table-cell text-left sm:w-28`}>NAT</th>
              <th className={`${TH} w-14 sm:w-20 text-right tabular-nums`}>Rating</th>
              <th className={`${TH} w-12 sm:w-16 text-right relative group cursor-help hidden sm:table-cell`}>
                <span>+/-</span>
                <Tip>Rating change, last 90 days</Tip>
              </th>
              <th className={`${TH} hidden sm:table-cell text-center sm:w-14 relative group cursor-help`}>
                <span>6m</span>
                <Tip center>Rank change, last 182 days</Tip>
              </th>
              <th className={`${TH} hidden sm:table-cell text-right sm:w-16 relative group cursor-help`}>
                <span>+/- 6m</span>
                <Tip>Rating change, last 182 days</Tip>
              </th>
              <th className={`${TH} hidden sm:table-cell sm:w-24 text-center`}>Trend</th>
              <th className="hidden sm:table-cell sm:w-12 h-9 py-0 align-middle text-right text-[11px] font-bold uppercase tracking-[0.08em] text-muted relative group cursor-help">
                <span>IJF</span>
                <Tip>Place in the IJF World Ranking List</Tip>
              </th>
              <th className="hidden sm:table-cell sm:w-12 h-9 py-0 align-middle text-left pl-1 text-[11px] font-bold uppercase tracking-[0.08em] text-muted relative group cursor-help">
                <span>±</span>
                <Tip center>IJF place compared with ours: ↓ lower in IJF, ↑ higher</Tip>
              </th>
              <th className={`${TH} hidden sm:table-cell sm:w-12 text-center`}>Age</th>
              <th className={`${TH} hidden sm:table-cell text-left sm:w-28`}>Last</th>
              <th className="w-10 sm:w-12 px-1 py-2 sm:py-2.5 text-center font-semibold text-muted" />
            </tr>
          </thead>
          <tbody className="text-ink text-[14px] leading-[20px]">
            {pageRows.map((row) => {
              const places90 = placesText(row.places_up_90d, row.entry);
              const places6m = placesText(row.places_up_6m);
              const change90 = changeText(row.score_change_90d);
              const change6m = changeText(row.score_change_6m);
              const isOpen = open.has(row.athlete_id);
              return (
                <Fragment key={row.athlete_id}>
                  <tr
                    onClick={() => router.push(`/athletes/${row.athlete_id}`)}
                    className="athlete-row border-b border-rule hover:bg-panel/60 transition-colors cursor-pointer"
                  >
                    <td className={`${CELL} px-1 w-9 sm:w-12 text-right tabular-nums whitespace-nowrap font-medium`}>
                      {row.place}
                    </td>
                    <td className={`${CELL} px-1 w-10 sm:w-14 text-center tabular-nums whitespace-nowrap font-medium ${places90.color}`}>
                      {places90.text}
                    </td>
                    <td className={`${CELL} font-medium text-ink truncate`}>
                      <Flag ioc={row.country} className="sm:!hidden mr-1.5" />
                      <Link
                        href={`/athletes/${row.athlete_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        <span className="sm:hidden">{shortName(row.family_name, row.given_name)}</span>
                        <span className="hidden sm:inline">{fullName(row.family_name, row.given_name)}</span>
                      </Link>
                    </td>
                    <td className={`${CELL} hidden sm:table-cell text-[12px] leading-[16px] whitespace-nowrap`}>
                      <div className="inline-flex items-center gap-1.5">
                        <Flag ioc={row.country} />
                        <span title={row.country ? COUNTRY_NAMES[row.country] : undefined}>{row.country}</span>
                      </div>
                    </td>
                    <td className={`${CELL} w-14 sm:w-20 text-right font-bold tabular-nums relative group cursor-pointer`}>
                      <span className="font-bold text-ink">{row.score}</span>
                      <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 z-30 bg-ink text-paper p-2.5 text-left whitespace-nowrap pointer-events-none select-none text-[11px] leading-tight font-normal">
                        <div className="flex justify-between gap-4 py-0.5">
                          <span>Glicko-2 rating</span>
                          <span>{row.rating}</span>
                        </div>
                        <div className="flex justify-between gap-4 py-0.5 text-rule">
                          <span>− 3 × RD ({row.rd})</span>
                          <span>{signed(row.score - row.rating)}</span>
                        </div>
                        <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-muted font-bold text-white tabular-nums">
                          <span>=</span>
                          <span>{row.score}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`${CELL} w-12 text-right font-medium hidden sm:table-cell ${change90.color}`}>
                      {change90.text}
                    </td>
                    <td className={`py-2 px-2 text-center hidden sm:table-cell ${places6m.color}`}>{places6m.text}</td>
                    <td className={`py-2 px-2 text-right font-medium hidden sm:table-cell ${change6m.color}`}>
                      {change6m.text}
                    </td>
                    <td className="py-2 px-2 text-center hidden sm:table-cell">
                      <Sparkline values={row.trend} />
                    </td>
                    <td className="hidden sm:table-cell text-right tabular-nums whitespace-nowrap text-ink">
                      {row.wrl_place ?? "–"}
                    </td>
                    <td className="hidden sm:table-cell text-left pl-1 tabular-nums whitespace-nowrap text-[12px] text-muted">
                      {ijfDifference(row.place, row.wrl_place)}
                    </td>
                    <td className="py-2 px-2 text-center hidden sm:table-cell">
                      {row.birth_year ? year - row.birth_year : "–"}
                    </td>
                    <td className="py-2 px-2 text-muted text-[12px] leading-[16px] truncate hidden sm:table-cell" title={row.last_competition_name ?? undefined}>
                      <span className="inline-flex items-center gap-2">
                        <span className="text-ink font-medium">
                          {competitionCode(row.last_competition_rank, row.last_competition_city)}
                        </span>
                        <span className="text-muted">{shortDate(row.last_contest)}</span>
                      </span>
                    </td>
                    <td
                      title="Show last 90 days"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      // start loading the contests on hover: by the click they are usually here
                      onPointerEnter={() => fetchAthleteHistory(row.athlete_id).catch(() => {})}
                      onClick={(e) => {
                        e.stopPropagation(); // expand, don't open the athlete
                        toggle(row.athlete_id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(row.athlete_id);
                        }
                      }}
                      className="w-10 sm:w-12 px-1 py-2 text-center text-muted cursor-pointer align-middle hover:bg-panel hover:text-ink"
                    >
                      <Icon size={16}
                        name="keyboard_arrow_down"
                        className={`inline-block transition-transform duration-200 leading-none align-middle ${isOpen ? "rotate-180" : ""}`}
                      />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="athlete-panel border-b border-rule">
                      <td className="p-0" colSpan={visibleColumns}>
                        <AthletePanel row={row} asOf={asOf} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {loading &&
              Array.from({ length: 20 }, (_, i) => (
                <tr key={i} className="athlete-row border-b border-rule">
                  <td colSpan={visibleColumns} className="px-3">
                    <div className="h-3 bg-rule/60 animate-pulse" style={{ width: `${40 + ((i * 37) % 45)}%` }} />
                  </td>
                </tr>
              ))}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={visibleColumns} className="px-3 text-[13px] text-muted">
                  No athletes match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        loading={loading}
        total={shown.length}
        first={first}
        count={pageRows.length}
        noun="athletes"
        pageSize={pageSize}
        onPageSize={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        page={currentPage}
        pages={pages}
        onPage={setPage}
      />
    </>
  );
}
