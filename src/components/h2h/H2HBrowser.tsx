"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";

import { Flag } from "@/components/Flag";
import { Icon } from "@/components/Icon";
import type { LeaderboardRow } from "@/lib/api";
import { fetchLeaderboard } from "@/lib/browser-api";
import { monthYear, shortName } from "@/lib/format";
import { COLORS, h2hPath, type Picked } from "@/lib/h2h";
import type { Matchup } from "@/lib/matchups";
import { MEN, WEIGHTS, WOMEN, weightTitle } from "@/lib/weights";

type Slot = keyof typeof COLORS;

const TH = "h-9 py-0 align-middle px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted";
const TD = "h-10 sm:h-11 py-0 align-middle px-2 sm:px-3";

// The weight and the two athletes, then the comparison (`result`, rendered on the
// server for the pair in the URL) or, while a pair is not picked, the popular matchups.
// The picks live here and go to the URL; the page renders the comparison for them.
export function H2HBrowser({
  weight: initialWeight,
  a: initialA,
  b: initialB,
  popular,
  result,
}: {
  weight: string | null; // slug
  a: Picked | null;
  b: Picked | null;
  popular: Matchup[];
  result: ReactNode;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [weight, setWeight] = useState(initialWeight);
  const [picks, setPicks] = useState<Record<Slot, Picked | null>>({ a: initialA, b: initialB });
  const inputA = useRef<HTMLInputElement>(null);

  const go = (w: string | null, next: Record<Slot, Picked | null>) => {
    setWeight(w);
    setPicks(next);
    startTransition(() => router.replace(h2hPath(w, next.a?.id ?? null, next.b?.id ?? null), { scroll: false }));
  };
  const both = picks.a && picks.b;
  // the comparison on screen is the server's for the URL's pair: shown when it is this one
  const current = both && picks.a!.id === initialA?.id && picks.b!.id === initialB?.id;

  return (
    <>
      <section className="mt-6 flex flex-col gap-3 sm:max-w-[560px]">
        <div>
          <label htmlFor="h2h-weight" className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
            Weight category
          </label>
          <select
            id="h2h-weight"
            value={weight ?? ""}
            onChange={(e) => {
              go(e.target.value, { a: null, b: null });
              inputA.current?.focus();
            }}
            className="w-full sm:w-64 h-10 px-3 bg-paper border border-rule text-[14px] text-ink focus:outline-none focus:border-ink cursor-pointer rounded-none"
          >
            <option value="" disabled>
              Choose weight
            </option>
            {[
              { label: "Men", weights: MEN },
              { label: "Women", weights: WOMEN },
            ].map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.weights.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {weightTitle(w)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {(["a", "b"] as const).map((slot) => (
          <AthleteSlot
            key={slot}
            slot={slot}
            weight={weight}
            picked={picks[slot]}
            other={picks[slot === "a" ? "b" : "a"]}
            inputRef={slot === "a" ? inputA : undefined}
            onPick={(athlete) => go(weight, { ...picks, [slot]: athlete })}
          />
        ))}
      </section>

      {!both && <PopularMatchups matchups={popular} onPick={(m) => {
        go(m.weight, { a: m.a, b: m.b });
        window.scrollTo(0, 0);
      }} />}
      {current && result}
    </>
  );
}

// One athlete: a search box over the weight's table, or the picked athlete.
function AthleteSlot({
  slot,
  weight,
  picked,
  other,
  inputRef,
  onPick,
}: {
  slot: Slot;
  weight: string | null;
  picked: Picked | null;
  other: Picked | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onPick: (athlete: Picked | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const api = WEIGHTS.find((w) => w.slug === weight)?.api;

  useEffect(() => {
    if (!api) return;
    let live = true;
    fetchLeaderboard(api).then(
      (table) => live && setRows(table),
      () => live && setRows([]),
    );
    return () => {
      live = false;
    };
  }, [api]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const needle = fold(query.trim());
  const found = needle
    ? rows
        .filter((row) => row.athlete_id !== other?.id && names(row).some((name) => name.startsWith(needle)))
        .slice(0, 3)
    : [];
  const pick = (row: LeaderboardRow) => {
    setQuery("");
    setOpen(false);
    onPick({
      id: row.athlete_id,
      family_name: row.family_name,
      given_name: row.given_name,
      country: row.country,
      score: row.score,
    });
  };

  return (
    <div ref={box} className="relative">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-2">
        <span className="w-3 h-[3px] shrink-0" style={{ background: COLORS[slot] }} />
        Athlete {slot === "a" ? 1 : 2}
      </div>
      {picked ? (
        <div className="h-10 px-3 border border-ink flex items-center gap-2 text-[14px]">
          <span className="flex">
            <Flag ioc={picked.country} />
          </span>
          <span className="font-semibold truncate">{shortName(picked.family_name, picked.given_name)}</span>
          <span className="text-[12px] text-muted shrink-0 tnum">{picked.score}</span>
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              onPick(null);
              // the search box replaces the name: focus it once it is there
              setTimeout(() => box.current?.querySelector("input")?.focus());
            }}
            className="ml-auto w-8 h-8 -mr-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            <Icon size={18} name="close" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Icon
            size={18}
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            disabled={!weight}
            value={query}
            placeholder={weight ? "Search athlete" : "Choose weight first"}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && found[0]) pick(found[0]);
              if (e.key === "Escape") setOpen(false);
            }}
            className="w-full h-10 pl-10 pr-3 bg-paper border border-rule text-[14px] text-ink placeholder:text-muted focus:outline-none focus:border-ink disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
          />
        </div>
      )}
      {open && needle && !picked && (
        <ul className="absolute z-40 left-0 right-0 top-full -mt-px bg-paper border border-ink">
          {found.length ? (
            found.map((row) => (
              <li key={row.athlete_id}>
                <button
                  type="button"
                  onClick={() => pick(row)}
                  className="w-full h-10 px-3 flex items-center gap-2 text-[14px] text-left hover:bg-panel cursor-pointer"
                >
                  <Flag ioc={row.country} />
                  <span className="font-medium truncate">{shortName(row.family_name, row.given_name)}</span>
                  <span className="ml-auto w-10 text-right font-semibold tnum shrink-0">{row.score}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="h-10 px-3 flex items-center text-[13px] text-muted">No athletes found</li>
          )}
        </ul>
      )}
    </div>
  );
}

// Lower case without accents: "Đorđe" is found by "dor".
function fold(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

// What a search can start with: the family name, the given name, "Heydarov H.".
function names(row: LeaderboardRow): string[] {
  return [row.family_name ?? "", row.given_name ?? "", shortName(row.family_name, row.given_name)].map(fold);
}

function PopularMatchups({ matchups, onPick }: { matchups: Matchup[]; onPick: (matchup: Matchup) => void }) {
  return (
    <section className="mt-10 lg:mt-12">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2">
        <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">
          Popular matchups
        </h2>
      </div>
      <table className="w-full table-fixed border-collapse text-[13px] sm:text-[14px] tnum">
        <thead>
          <tr className="bg-panel border-b border-rule">
            <th className={`${TH} text-left`}>Athletes</th>
            <th className={`${TH} text-right w-14 sm:w-20`}>Score</th>
            <th className={`${TH} text-right w-28 hidden sm:table-cell`}>Last meeting</th>
            <th className="w-6 h-9 py-0 pl-1 pr-0" />
          </tr>
        </thead>
        <tbody>
          {matchups.map((m) => (
            <tr
              key={`${m.a.id}-${m.b.id}`}
              onClick={() => onPick(m)}
              className="border-b border-rule hover:bg-panel/40 cursor-pointer"
            >
              <td className={TD}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <MatchupName athlete={m.a} />
                  <span className="text-muted px-1 shrink-0">vs</span>
                  <MatchupName athlete={m.b} />
                </div>
              </td>
              <td className={`${TD} w-14 sm:w-20 text-right font-semibold`}>
                {m.wins}–{m.losses}
              </td>
              <td className={`${TD} w-28 text-right text-muted hidden sm:table-cell`}>{monthYear(m.last)}</td>
              <td className="w-6 h-10 sm:h-11 py-0 align-middle pl-1 pr-0 text-right text-muted">
                <Icon size={18} name="chevron_right" className="align-middle" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function MatchupName({ athlete }: { athlete: Picked }) {
  return (
    <>
      <Flag ioc={athlete.country} />
      <span className="font-medium truncate">
        <span className="sm:hidden">{shortName(athlete.family_name, null)}</span>
        <span className="hidden sm:inline">{shortName(athlete.family_name, athlete.given_name)}</span>
      </span>
    </>
  );
}
