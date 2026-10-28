"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import { isUpset } from "@/components/rankings/Changes";
import type { HistoryRow } from "@/lib/api";
import { roundCode, shortDate, shortName, signed } from "@/lib/format";
import { pageNumbers } from "@/lib/pages";

const SORTS = {
  "date-desc": "Sort: date ↓",
  "date-asc": "Sort: date ↑",
  "chance-asc": "Sort: chance ↑",
  "chance-desc": "Sort: chance ↓",
  "gain-desc": "Sort: rating change ↓",
  "gain-asc": "Sort: rating change ↑",
} as const;
type Sort = keyof typeof SORTS;

const RESULTS = {
  "": "All contests",
  w: "Wins",
  l: "Losses",
  uw: "Upset wins",
  ul: "Upset losses",
} as const;
type Result = keyof typeof RESULTS;

const PAGE_SIZES = [20, 50, 100];
const CONTROL =
  "h-8 py-0 px-2.5 bg-paper border border-rule text-[12px] text-ink focus:outline-none focus:border-ink cursor-pointer min-w-0";
const CELL = "px-2 sm:px-3 h-10 sm:h-11 py-0 align-middle";
const TH = "px-2 sm:px-3 align-middle h-9 py-0";

const gain = (contest: HistoryRow) => contest.rating_after - contest.rating_before;

// Every contest of the athlete in the chosen weight, grouped by competition while
// sorted by date.
export function Contests({ contests, fileName }: { contests: HistoryRow[]; fileName: string }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<Result>("");
  const [sort, setSort] = useState<Sort>("date-desc");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const years = [...new Set(contests.map((c) => c.fought_on.slice(0, 4)))];
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = contests.filter((c) => {
      const upset = isUpset(c.won, c.win_probability);
      return (
        (!year || c.fought_on.startsWith(year)) &&
        (result === "" ||
          (result === "w" && c.won) ||
          (result === "l" && !c.won) ||
          (result === "uw" && c.won && upset) ||
          (result === "ul" && !c.won && upset)) &&
        (!needle ||
          `${c.opponent_family_name ?? ""} ${c.opponent_given_name ?? ""} ${c.competition}`
            .toLowerCase()
            .includes(needle))
      );
    });
    // the history comes latest first
    if (sort === "date-asc") return [...filtered].reverse();
    if (sort === "chance-asc") return [...filtered].sort((a, b) => a.win_probability - b.win_probability);
    if (sort === "chance-desc") return [...filtered].sort((a, b) => b.win_probability - a.win_probability);
    if (sort === "gain-desc") return [...filtered].sort((a, b) => gain(b) - gain(a));
    if (sort === "gain-asc") return [...filtered].sort((a, b) => gain(a) - gain(b));
    return filtered;
  }, [contests, query, year, result, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pages);
  const first = (currentPage - 1) * pageSize;
  const pageRows = shown.slice(first, first + pageSize);
  const grouped = sort.startsWith("date");
  // a competition's change and result, from all its contests (not only this page's)
  const totals = new Map<number, number>();
  for (const c of contests) totals.set(c.competition_id, (totals.get(c.competition_id) ?? 0) + gain(c));

  const reset = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };

  return (
    <section className="mt-14 md:mt-16">
      <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight text-ink">
        Contests
      </h2>
      <div className="mt-3 border-b-2 border-ink pb-2 flex flex-col lg:flex-row lg:items-center gap-2">
        <div className="relative w-full md:w-72 lg:w-56 shrink-0">
          <Icon size={16} name="search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
            placeholder="Search opponent or tournament"
            className="w-full h-8 pl-8 pr-2.5 bg-paper border border-rule text-[12px] placeholder:text-muted focus:outline-none focus:border-ink"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <select value={year} onChange={(e) => reset(setYear)(e.target.value)} className={CONTROL}>
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select value={result} onChange={(e) => reset(setResult)(e.target.value as Result)} className={CONTROL}>
            {Object.entries(RESULTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end lg:ml-auto">
          <div className="min-w-0 grid md:block">
            <select value={sort} onChange={(e) => reset(setSort)(e.target.value as Sort)} className={CONTROL}>
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => downloadCsv(shown, fileName)}
            className="w-full md:w-auto shrink-0 h-8 px-3 inline-flex items-center justify-center gap-1.5 border border-rule text-[12px] text-ink hover:border-ink"
          >
            <Icon size={16} name="download" className="text-muted" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-9 bg-panel border-b border-rule text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">
              <th className={`${TH} w-14 sm:w-16`}>Round</th>
              <th className={TH}>Opponent</th>
              <th className={`${TH} w-20 text-right hidden sm:table-cell`}>Opp.</th>
              <th className={`${TH} w-28 text-right hidden sm:table-cell`}>Chance</th>
              <th className={`${TH} w-10 text-center`}>Result</th>
              <th className={`${TH} w-14 text-right`}>+/−</th>
              <th className="w-6 px-1 text-right align-middle h-9 py-0" />
            </tr>
          </thead>
          <tbody className="text-[13px] sm:text-[14px]">
            {pageRows.map((contest, index) => {
              const opensGroup =
                grouped && (index === 0 || pageRows[index - 1].competition_id !== contest.competition_id);
              return (
                <Fragment key={contest.contest_id}>
                  {opensGroup && <CompetitionRow contest={contest} total={totals.get(contest.competition_id) ?? 0} />}
                  <ContestRow contest={contest} />
                </Fragment>
              );
            })}
            {pageRows.length === 0 && (
              <tr className="h-10">
                <td colSpan={7} className="px-3 text-[13px] text-muted">
                  No contests match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px] text-muted">
        <div className="flex items-center gap-3">
          <span>
            {shown.length ? `${first + 1}–${first + pageRows.length} of ${shown.length} contests` : "0 contests"}
          </span>
          <span className="inline-block w-px h-3 bg-rule" />
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => reset(setPageSize)(size)}
                className={size === pageSize ? "font-bold text-ink underline" : "hover:text-ink cursor-pointer"}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="hover:text-ink px-1 disabled:opacity-40"
          >
            ‹
          </button>
          {pageNumbers(currentPage, pages).map((n, i) =>
            n === "…" ? (
              <span key={`gap-${i}`} className="px-1">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={
                  n === currentPage
                    ? "font-bold text-ink border-b-2 border-claret px-1.5 pb-0.5"
                    : "hover:text-ink px-1.5 cursor-pointer"
                }
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            disabled={currentPage === pages}
            onClick={() => setPage(currentPage + 1)}
            className="hover:text-ink px-1 disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

const MEDALS: Record<string, string> = {
  gold: "bg-[#F1E3B3] text-[#8A6A00] border-[#E8D49E]",
  silver: "bg-[#E4E4E4] text-[#5A5A5A] border-[#D2D2D2]",
  bronze: "bg-[#EBD5C3] text-[#8A4B1F] border-[#DDBFA6]",
};

function CompetitionRow({ contest, total }: { contest: HistoryRow; total: number }) {
  const medal = contest.result ? MEDALS[contest.result] : undefined;
  return (
    <tr className="h-8 bg-panel border-b border-rule">
      <td colSpan={7} className="px-2 sm:px-3 h-8 py-0 align-middle">
        {/* w-0 min-w-full: a long name is cut, it does not widen the table */}
        <div className="flex items-center justify-between w-0 min-w-full">
          <div className="flex items-baseline gap-2 truncate pr-2">
            <span className="text-[12px] font-bold uppercase text-ink truncate">{contest.competition}</span>
            <span className="text-[11px] text-muted shrink-0">{shortDate(contest.fought_on)}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {medal ? (
              <span className={`px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border ${medal}`}>
                {contest.result}
              </span>
            ) : (
              contest.result && (
                <span className="text-[11px] font-semibold text-muted">
                  {/^\d/.test(contest.result) ? contest.result : roundCode(contest.result)}
                </span>
              )
            )}
            <span className={`text-[12px] font-bold ${total >= 0 ? "text-gain" : "text-drop"}`}>{signed(total)}</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function ContestRow({ contest }: { contest: HistoryRow }) {
  const chance = Math.round(contest.win_probability * 100);
  const upset = isUpset(contest.won, contest.win_probability);
  const color = contest.won ? "text-gain" : "text-drop";
  return (
    <tr className="h-10 sm:h-11 border-b border-rule hover:bg-panel/40">
      <td className={`${CELL} text-muted`}>{roundCode(contest.round)}</td>
      <td className={CELL}>
        <div className="flex items-center gap-2 min-w-0">
          <Flag ioc={contest.opponent_country} />
          <Link href={`/athletes/${contest.opponent_id}`} className="font-medium text-ink truncate hover:underline">
            {shortName(contest.opponent_family_name, contest.opponent_given_name)}
          </Link>
        </div>
      </td>
      <td className={`${CELL} text-right tabular-nums hidden sm:table-cell text-ink`}>{contest.opponent_score}</td>
      <td className={`${CELL} text-right hidden sm:table-cell`}>
        <span className="inline-flex items-center justify-end gap-3">
          {upset && (
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.05em] px-1 py-0.5 border leading-none ${contest.won ? "text-gain border-gain" : "text-drop border-drop"}`}
            >
              Upset
            </span>
          )}
          <span className="text-muted">{chance}%</span>
        </span>
      </td>
      <td className={`${CELL} text-center font-bold ${color}`}>{contest.won ? "W" : "L"}</td>
      <td className={`${CELL} text-right font-bold ${color}`}>{signed(gain(contest))}</td>
      <td className="px-1 text-right text-muted h-10 sm:h-11 py-0 align-middle">
        <Icon size={18} name="chevron_right" className="align-middle" />
      </td>
    </tr>
  );
}

function downloadCsv(contests: HistoryRow[], fileName: string) {
  const header = ["Date", "Competition", "Round", "Opponent", "Opponent country", "Opponent rating", "Chance", "Result", "Rating change"];
  const lines = contests.map((c) => [
    c.fought_on,
    c.competition,
    c.round ?? "",
    `${c.opponent_family_name ?? ""} ${c.opponent_given_name ?? ""}`.trim(),
    c.opponent_country ?? "",
    c.opponent_score ?? "",
    Math.round(c.win_probability * 100),
    c.won ? "W" : "L",
    gain(c),
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
