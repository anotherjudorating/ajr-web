"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CsvButton, ExploreTitle, SearchBox, Select, ToolbarRow } from "@/components/explore/Controls";
import { useFilters } from "@/components/explore/useFilters";
import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { isUpset } from "@/components/rankings/Changes";
import { HEAD_CELL, Pagination, PlaceholderRows, saveCsv } from "@/components/rankings/TableParts";
import { RowLink } from "@/components/RowLink";
import type { ContestListRow } from "@/lib/api";
import { competitionCode, roundCode, shortCompetition, shortDate, shortName, signed } from "@/lib/format";
import { WEIGHTS, weightTitle } from "@/lib/weights";

const SORTS = [
  { value: "date-desc", label: "Sort: date ↓" },
  { value: "date-asc", label: "Sort: date ↑" },
  { value: "chance-asc", label: "Sort: winner's chance ↑" },
];
const PATH = "/explore/contests";
const CELL = "px-2 sm:px-3 py-2 align-middle";

// A year's contests, a page at a time; the filters are in the URL and the server
// fetches the page.
export function ContestsBrowser({
  rows,
  filters,
  tournaments,
  years,
  loading = false,
}: {
  rows: ContestListRow[];
  filters: Record<string, string>;
  tournaments: { id: number; name: string; rank: string | null; country: string | null }[];
  years: number[];
  loading?: boolean;
}) {
  const set = useFilters(PATH, filters);
  const [query, setQuery] = useState(filters.q ?? "");
  // the search goes to the URL once typing pauses
  useEffect(() => {
    if (query === (filters.q ?? "")) return;
    const timer = setTimeout(() => set({ q: query }), 300);
    return () => clearTimeout(timer);
  }, [query, filters.q, set]);

  const byId = new Map(tournaments.map((t) => [t.id, t]));
  const size = Number(filters.size) || 50;
  const page = Number(filters.page) || 1;
  const total = rows[0]?.total ?? 0;

  return (
    <>
      <ExploreTitle title="Contests" lead="Every rated contest with win chances and rating changes." />
      <ToolbarRow>
        <SearchBox value={query} onChange={setQuery} placeholder="Search athlete" />
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <Select
            value={filters.tournament ?? ""}
            onChange={(value) => set({ tournament: value })}
            options={[{ value: "", label: "All tournaments" }, ...tournaments.map((t) => ({ value: String(t.id), label: shortCompetition(t.name) }))]}
            className="md:max-w-[180px]"
          />
          <Select
            value={filters.year ?? ""}
            onChange={(value) => set({ year: value, tournament: "" })}
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
          />
          <Select
            value={filters.weight ?? ""}
            onChange={(value) => set({ weight: value })}
            options={[{ value: "", label: "All weights" }, ...WEIGHTS.map((w) => ({ value: w.slug, label: weightTitle(w) }))]}
          />
          <Select
            value={filters.result ?? ""}
            onChange={(value) => set({ result: value })}
            options={[
              { value: "", label: "All contests" },
              { value: "upsets", label: "Upsets" },
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <Select value={filters.sort ?? "date-desc"} onChange={(value) => set({ sort: value })} options={SORTS} />
          </div>
          <CsvButton onClick={() => downloadCsv(rows, filters.year ?? "")} />
        </div>
      </ToolbarRow>

      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${HEAD_CELL} text-left`}>Athletes</th>
            <th className={`${HEAD_CELL} hidden md:table-cell w-36 text-left`}>Tournament</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell w-16 text-left`}>Weight</th>
            <th className={`${HEAD_CELL} hidden sm:table-cell w-16 text-left`}>Round</th>
            <th className={`${HEAD_CELL} sm:hidden w-16 text-left`}>Round</th>
            <th className={`${HEAD_CELL} hidden lg:table-cell w-20`} />
            <th className={`${HEAD_CELL} w-14 sm:w-20 text-right`}>Chance</th>
            <th className={`${HEAD_CELL} w-10 text-center`}>W/L</th>
            <th className={`${HEAD_CELL} w-12 sm:w-16 text-right`}>+/−</th>
            <th className="w-6 sm:w-8 h-9 py-0" />
          </tr>
        </thead>
        <tbody className="text-[13px] sm:text-[14px]">
          {loading && <PlaceholderRows columns={10} count={12} />}
          {rows.map((row) => {
            const sides = [
              { id: row.white_id, family: row.white_family_name, given: row.white_given_name, country: row.white_country, chance: row.white_chance, change: row.white_change, judogi: "bg-paper" },
              { id: row.blue_id, family: row.blue_family_name, given: row.blue_given_name, country: row.blue_country, chance: row.blue_chance, change: row.blue_change, judogi: "bg-oxford" },
            ];
            const upset = sides.some((s) => s.id === row.winner_id && isUpset(true, s.chance));
            return (
              <RowLink key={row.contest_id} href={`/contests/${row.contest_id}`} className="border-b border-rule hover:bg-panel/40">
                <td className={CELL}>
                  {sides.map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 min-w-0 h-6">
                      <span className={`hidden sm:inline-block w-[6px] h-4 shrink-0 border border-ink ${s.judogi}`} />
                      <Flag ioc={s.country} />
                      <Link
                        href={`/athletes/${s.id}`}
                        className={`truncate hover:underline ${s.id === row.winner_id ? "font-semibold text-ink" : "text-muted"}`}
                      >
                        {shortName(s.family, s.given)}
                      </Link>
                    </div>
                  ))}
                </td>
                <td className={`${CELL} hidden md:table-cell`}>
                  <div className="truncate text-ink">{shortCompetition(row.competition)}</div>
                  <div className="text-[12px] text-muted">{shortDate(row.day)} {row.day.slice(0, 4)}</div>
                </td>
                <td className={`${CELL} hidden sm:table-cell text-muted`}>{row.weight?.replace("-", "−")}</td>
                <td className={`${CELL} hidden sm:table-cell text-muted`}>{roundCode(row.round)}</td>
                {/* on phones the tournament (its nation's flag and level) above the round */}
                <td className={`${CELL} sm:hidden text-muted`}>
                  <div className="flex items-center gap-1 h-6">
                    <Flag ioc={byId.get(row.competition_id)?.country ?? null} />
                    {competitionCode(byId.get(row.competition_id)?.rank ?? null, null)}
                  </div>
                  <div className="h-6 leading-6">{roundCode(row.round)}</div>
                </td>
                <td className={`${CELL} hidden lg:table-cell text-right`}>
                  {upset && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 border border-gain text-gain">
                      Upset
                    </span>
                  )}
                </td>
                <td className={`${CELL} text-right tabular-nums`}>
                  {sides.map((s) => {
                    const won = s.id === row.winner_id;
                    const surprise = upset && (won ? "text-gain font-semibold" : "text-drop font-semibold");
                    return (
                      <div key={s.id} className={`h-6 leading-6 ${surprise || "text-muted"}`}>
                        {Math.round(s.chance * 100)}%
                      </div>
                    );
                  })}
                </td>
                <td className={`${CELL} text-center font-bold`}>
                  {sides.map((s) => (
                    <div key={s.id} className={`h-6 leading-6 ${s.id === row.winner_id ? "text-gain" : "text-drop"}`}>
                      {s.id === row.winner_id ? "W" : "L"}
                    </div>
                  ))}
                </td>
                <td className={`${CELL} text-right font-bold tabular-nums`}>
                  {sides.map((s) => (
                    <div key={s.id} className={`h-6 leading-6 ${s.change >= 0 ? "text-gain" : "text-drop"}`}>
                      {signed(s.change)}
                    </div>
                  ))}
                </td>
                <td className="py-2 align-middle pl-1 pr-0 sm:px-2 text-right text-muted">
                  <Icon size={18} name="chevron_right" className="align-middle" />
                </td>
              </RowLink>
            );
          })}
        </tbody>
      </table>
      {!loading && rows.length === 0 && <p className="py-6 text-[14px] text-muted">No contests match these filters.</p>}
      <Pagination
        loading={loading}
        total={total}
        first={(page - 1) * size}
        count={rows.length}
        noun="contests"
        pageSize={size}
        onPageSize={(value) => set({ size: String(value) })}
        page={page}
        pages={Math.max(1, Math.ceil(total / size))}
        onPage={(value) => set({ page: String(value) })}
      />
    </>
  );
}

function downloadCsv(rows: ContestListRow[], year: string) {
  const name = (family: string | null, given: string | null) => `${family ?? ""} ${given ?? ""}`.trim();
  const header = ["Date", "Tournament", "Weight", "Round", "White", "White chance", "Blue", "Blue chance", "Winner"];
  const lines = rows.map((r) => [
    r.day,
    r.competition,
    r.weight ?? "",
    r.round ?? "",
    name(r.white_family_name, r.white_given_name),
    Math.round(r.white_chance * 100),
    name(r.blue_family_name, r.blue_given_name),
    Math.round(r.blue_chance * 100),
    r.winner_id === r.white_id ? "White" : "Blue",
  ]);
  saveCsv([header, ...lines], `ajr-contests-${year}.csv`);
}
