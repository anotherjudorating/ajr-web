"use client";

import { useEffect, useState } from "react";

import { useRowMark, useRowScroll } from "@/components/anchors";
import { nearest } from "@/components/chart";
import { PERIOD_EVENT, type PeriodPick } from "@/components/country/NationChart";

import { Icon } from "@/components/Icon";
import { Medal, type MedalKind } from "@/components/Medal";
import { CsvButton, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { Pagination, saveCsv } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import { H2, HEAD_CELL, ROW_CELL } from "@/components/tournament/styles";
import type { CountryTournament } from "@/lib/api";
import { formatDate, shortCompetition } from "@/lib/format";
import { LEVELS, levelOf } from "@/lib/levels";

const KINDS: MedalKind[] = ["gold", "silver", "bronze"];
const SIZES = [10, 20, 50];
const SORTS = [
  { value: "date-desc", label: "Sort: date ↓" },
  { value: "date-asc", label: "Sort: date ↑" },
  { value: "medals-desc", label: "Sort: medals ↓" },
];
type Sort = "date-desc" | "date-asc" | "medals-desc";

// Every tournament the nation's athletes fought at, newest first, with their medals,
// a page at a time (as medals by nation). The full name where there is room, the
// short one (World Ch., GS) on a phone.
//
// A click on the rating chart's point marks its period's tournaments.
export function Tournaments({ rows: all, ioc }: { rows: CountryTournament[]; ioc: string }) {
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState<Sort>("date-desc");
  // a click on the rating chart's point: its period's tournaments marked (as a
  // ranking's row from a link), the filters cleared, their page opened and scrolled to
  const [marked, setMarked] = useState<{ ids: number[]; n: number } | null>(null);
  useEffect(() => {
    const onPick = (e: Event) => {
      const pick = (e as CustomEvent<PeriodPick>).detail;
      const inside = all.filter((t) => day(t) > pick.after && day(t) <= pick.until);
      // none in the period: the nearest one, so the list still says where it stands
      const ids = (inside.length ? inside : [nearest(all, (t) => Math.abs(day(t) - pick.until))]).map((t) => t.id);
      const index = byDate(all).findIndex((t) => ids.includes(t.id));
      setQuery("");
      setYear("");
      setLevel("");
      setSort("date-desc");
      setPage(Math.floor(index / size) + 1);
      setMarked((previous) => ({ ids, n: (previous?.n ?? 0) + 1 }));
    };
    window.addEventListener(PERIOD_EVENT, onPick);
    return () => window.removeEventListener(PERIOD_EVENT, onPick);
  }, [all, size]);
  const lit = useRowMark(marked !== null, String(marked?.n ?? 0));
  const firstMarked = marked ? `tournament-${marked.ids[0]}` : "";
  useRowScroll(firstMarked, marked !== null, String(marked?.n ?? 0));
  const reset = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };
  const medals = (t: CountryTournament) => t.gold * 1e6 + t.silver * 1e3 + t.bronze;
  const years = [...new Set(all.map((t) => t.date_from.slice(0, 4)))];
  const levels = LEVELS.map((l) => l.title).filter((title) => all.some((t) => levelOf(t.rank_name) === title));
  const needle = query.trim().toLowerCase();
  const rows = all
    .filter(
      (t) =>
        (!year || t.date_from.startsWith(year)) &&
        (!level || levelOf(t.rank_name) === level) &&
        (!needle || t.name.toLowerCase().includes(needle)),
    )
    .sort((a, b) => (sort === "date-asc" ? day(a) - day(b) : sort === "medals-desc" ? medals(b) - medals(a) || day(b) - day(a) : day(b) - day(a)));
  if (all.length === 0) return null;
  const shown = rows.slice((page - 1) * size, page * size);
  return (
    <section id="tournaments">
      <h2 className={H2}>Tournaments</h2>
      <ToolbarRow>
        <SearchBox value={query} onChange={reset(setQuery)} placeholder="Search tournament" />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select
            value={year}
            onChange={reset(setYear)}
            options={[{ value: "", label: "All years" }, ...years.map((y) => ({ value: y, label: y }))]}
          />
          <Select
            value={level}
            onChange={reset(setLevel)}
            options={[{ value: "", label: "All levels" }, ...levels.map((l) => ({ value: l, label: l }))]}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={sort} onChange={(value) => reset(setSort)(value as Sort)} options={SORTS} />
          </div>
          <CsvButton onClick={() => downloadCsv(rows, ioc)} />
        </div>
      </ToolbarRow>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tabular-nums">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Tournament</th>
            <th className={`${HEAD_CELL} text-left w-28 hidden sm:table-cell`}>Date</th>
            {KINDS.map((kind) => (
              <th key={kind} className={`${HEAD_CELL} text-center w-11 sm:w-14`} title={kind}>
                <span className="inline-flex justify-center w-full">
                  <Medal kind={kind} />
                </span>
              </th>
            ))}
            <th className={`${HEAD_CELL} text-right w-16 hidden sm:table-cell`}>Total</th>
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {shown.map((t) => (
            <RowLink
              key={t.id}
              id={`tournament-${t.id}`}
              href={`/tournaments/${t.id}`}
              className={`border-b border-rule hover:bg-panel/40 ${marked?.ids.includes(t.id) ? lit.row : ""}`}
            >
              <td className={ROW_CELL}>
                <span className="font-medium truncate block sm:hidden">{shortCompetition(t.name)}</span>
                <span className="font-medium truncate hidden sm:block">{t.name.replace(/\s+Individuals?$/i, "")}</span>
              </td>
              <td className={`${ROW_CELL} text-muted whitespace-nowrap hidden sm:table-cell`}>{formatDate(t.date_from)}</td>
              {KINDS.map((kind) => (
                <td key={kind} className={`${ROW_CELL} text-center`}>
                  {t[kind]}
                </td>
              ))}
              <td className={`${ROW_CELL} text-right font-semibold hidden sm:table-cell`}>{t.gold + t.silver + t.bronze}</td>
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </RowLink>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="py-6 text-[14px] text-muted">No tournaments match these filters.</p>}
      {rows.length > SIZES[0] && (
        <Pagination
          total={rows.length}
          first={(page - 1) * size}
          count={shown.length}
          noun="tournaments"
          pageSize={size}
          sizes={SIZES}
          onPageSize={(value) => {
            setSize(value);
            setPage(1);
          }}
          page={page}
          pages={Math.ceil(rows.length / size)}
          onPage={setPage}
        />
      )}
    </section>
  );
}

const day = (t: CountryTournament) => new Date(t.date_from).getTime();
const byDate = (rows: CountryTournament[]) => [...rows].sort((a, b) => day(b) - day(a));

function downloadCsv(rows: CountryTournament[], ioc: string) {
  const lines = [
    ["date", "tournament", "level", "athletes", "gold", "silver", "bronze"],
    ...rows.map((t) => [t.date_from, t.name, t.rank_name ?? "", t.athletes, t.gold, t.silver, t.bronze]),
  ];
  saveCsv(lines, `ajr-${ioc.toLowerCase()}-tournaments.csv`);
}
