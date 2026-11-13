"use client";

import Link from "next/link";

import { Flag } from "@/components/Flag";
import { changeText, ijfDifference, placesText } from "@/components/rankings/Changes";
import type { Athlete } from "@/lib/api";
import type { LastRating } from "@/lib/inactive";
import { peakTableLink } from "@/lib/anchors";
import { fullName, ijfProfile, monthYear } from "@/lib/format";
import type { Highlight, Standing } from "@/lib/standing";
import { WEIGHTS } from "@/lib/weights";

const LABEL = "text-xs uppercase tracking-wider text-muted font-semibold";
const BIG = "font-serif text-[28px] leading-tight font-bold text-ink";
const LINKED = "underline decoration-rule decoration-2 underline-offset-4 hover:decoration-ink";

// Name, weights, places and the rating with its parts.
export function AthleteHeader({
  athlete,
  weight,
  onWeight,
  today,
  inactive,
  standing,
  run,
  onRun,
}: {
  athlete: Athlete;
  weight: string | null;
  onWeight: (weight: string) => void;
  today: string;
  inactive: LastRating | null; // over a year without a contest: the rating then
  standing: Standing | null; // the best place and the weeks at the top, in this weight
  run: Highlight | null; // the longest run shown on the chart
  onRun: (run: Highlight | null) => void;
}) {
  // a run of the table on the chart (its longest one alone)
  const shownRun = (streak: { from: string | null; to: string | null }) =>
    run?.spans.length === 1 && run.spans[0].from === streak.from && run.spans[0].to === streak.to;
  // the best place's table: the Monday it was first reached, at the athlete's row
  const slug = WEIGHTS.find((w) => w.api === weight)?.slug;
  const bestLink =
    standing && slug ? `${standing.bestOn >= today ? `/rankings/${slug}` : `/rankings/${slug}/${standing.bestOn}`}#athlete-${athlete.id}` : null;
  const peakLink = peakTableLink(athlete, today);
  const age = athlete.birth_year ? Number(today.slice(0, 4)) - athlete.birth_year : null;
  // an inactive athlete: the rating after the last contest, not today's (lowered only
  // by the uncertainty grown since)
  const rating = inactive ? inactive.rating : (athlete.rating ?? 0);
  const score = inactive ? inactive.score : (athlete.score ?? 0);
  const uncertainty = rating - score; // RD_FACTOR × RD (lib/h2h.ts), rounded as the score is

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-5 uppercase text-[11px] font-semibold text-muted mb-3 tracking-wider">
            <span>{athlete.gender === "female" ? "Women" : "Men"}</span>
            <div className="flex items-center gap-5">
              {athlete.weights.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onWeight(w)}
                  className={
                    w === weight
                      ? "font-bold text-ink border-b-2 border-claret pb-0.5 uppercase"
                      : "text-muted hover:text-ink pb-0.5 border-b-2 border-transparent uppercase cursor-pointer"
                  }
                >
                  {w.replace("-", "−")} kg
                </button>
              ))}
            </div>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-bold tracking-tight">
            {fullName(athlete.family_name, athlete.given_name)}
          </h1>
          <div className="text-sm text-muted mt-1.5 flex items-center">
            {/* the nation's page */}
            {athlete.country ? (
              <Link href={`/countries/${athlete.country.toLowerCase()}`} className="group inline-flex items-center hover:text-ink">
                <Flag ioc={athlete.country} className="mr-2" />
                <span className="group-hover:underline">{athlete.country_name ?? athlete.country}</span>
              </Link>
            ) : (
              <span>{athlete.country_name}</span>
            )}
            {age !== null && (
              <>
                <span className="inline-block w-px h-3 bg-rule mx-3 align-middle" />
                <span>{age} y.o.</span>
              </>
            )}

          </div>
        </div>

        <div className="w-full md:w-[460px] max-w-[460px] md:ml-auto self-start">
          <div className="flex justify-between items-start gap-2 sm:gap-4">
            <div className="flex flex-col">
              <span className={LABEL}>Rank</span>
              {inactive ? (
                // why there is no rank: no contest in any weight for a year
                <span
                  className="font-serif text-[22px] leading-[38px] font-bold text-ink mt-1"
                  title="No contest for over a year: out of the tables until the next one"
                >
                  Inactive
                </span>
              ) : (
                <span className={`${BIG} mt-1`}>{athlete.place ? `#${athlete.place}` : "–"}</span>
              )}
            </div>
            {standing ? (
              <div className="flex flex-col items-start">
                <span className={LABEL}>Best</span>
                <div className="flex items-center gap-2 mt-1">
                  {bestLink ? (
                    <Link href={bestLink} className={`${BIG} ${LINKED}`} title="The table of that week">
                      #{standing.best}
                    </Link>
                  ) : (
                    <span className={BIG}>#{standing.best}</span>
                  )}
                  <span className="text-xs text-muted leading-tight">{monthYear(standing.bestOn)}</span>
                </div>
              </div>
            ) : (
            <div className="flex flex-col items-start">
              <span className={LABEL}>Peak</span>
              <div className="flex items-center gap-2 mt-1">
                {peakLink && athlete.peak_place ? (
                  // the table of that day, at the athlete's row
                  <Link href={peakLink} className={`${BIG} ${LINKED}`} title="The table of that week">
                    #{athlete.peak_place}
                  </Link>
                ) : (
                  <span className={BIG}>{athlete.peak_place ? `#${athlete.peak_place}` : "–"}</span>
                )}
                {athlete.peak_score !== null && athlete.peak_on && (
                  <div className="leading-tight flex flex-col">
                    <span className="text-xs font-semibold text-ink tabular-nums">{athlete.peak_score}</span>
                    <span className="text-xs text-muted">{monthYear(athlete.peak_on)}</span>
                  </div>
                )}
              </div>
            </div>
            )}
            <div
              className="flex flex-col items-start"
              title="Position in the IJF World Ranking List. ↑ higher in IJF than in AJR, ↓ lower. Opens the athlete's IJF profile."
            >
              <span className={LABEL}>IJF</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                {/* our ids are the IJF's: the profile with its ranking and results */}
                <a href={ijfProfile(athlete.id)} target="_blank" rel="noopener" className={`${BIG} ${LINKED}`}>
                  {athlete.wrl_place ? `#${athlete.wrl_place}` : "–"}
                </a>
                {athlete.place && athlete.wrl_place && (
                  <span className="text-xs text-muted">{ijfDifference(athlete.place, athlete.wrl_place)}</span>
                )}
              </div>
            </div>
          </div>

          {standing && (standing.atOne.weeks > 0 || standing.p4pAtOne.weeks > 0) && (
            // the weeks at #1: in this weight and pound for pound (only the rows with a
            // week), each with its longest run
            <div className="mt-4 tabular-nums text-xs">
              <div className="grid grid-cols-3 gap-4 pb-1 text-[11px] uppercase tracking-wider text-muted font-semibold text-right">
                <span className="text-left">Weeks</span>
                <span>Total</span>
                <span>Longest run</span>
              </div>
              {(
                [
                  ["At #1", "at #1", standing.atOne],
                  ["P4P #1", "at #1 pound for pound", standing.p4pAtOne],
                ] as const
              )
                .filter(([, , streak]) => streak.weeks > 0)
                .map(([label, phrase, streak]) => (
                  <div key={label} className="grid grid-cols-3 gap-4 py-0.5 items-start text-right">
                    <span className="text-muted text-left">{label}</span>
                    <span className="font-bold text-sm text-ink">{streak.weeks}</span>
                    {/* the run on the Rank chart (again: off) */}
                    <span>
                      <button
                        type="button"
                        title="Show it on the chart"
                        data-run
                        onClick={() => {
                          onRun(shownRun(streak) ? null : { spans: [{ from: streak.from!, to: streak.to! }], label: `${streak.longest} ${streak.longest === 1 ? "week" : "weeks"} ${phrase}` });
                        }}
                        className={`font-medium text-sm cursor-pointer ${LINKED} ${shownRun(streak) ? "text-claret" : "text-ink"}`}
                      >
                        {streak.longest}
                      </button>
                    </span>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-5 flex justify-between items-end gap-4">
            <div className="flex flex-col">
              <div className="font-serif text-[56px] leading-none font-bold text-ink tabular-nums">{score}</div>
              <span className={`${LABEL} mt-2`}>
                {inactive ? `Last rating, ${monthYear(inactive.day)}` : "Current rating"}
              </span>
            </div>
            <div className="tabular-nums text-xs pb-1">
              <div className="grid grid-cols-3 gap-4 pb-1 text-[11px] uppercase tracking-wider text-muted font-semibold text-right">
                <span className="text-left">Change</span>
                <span>Rating</span>
                <span>Rank</span>
              </div>
              {/* no changes for an inactive athlete: only the uncertainty moved */}
              <ChangeRow label="90 days" score={inactive ? null : athlete.score_change_90d} places={inactive ? null : athlete.places_up_90d} />
              <ChangeRow label="6 months" score={inactive ? null : athlete.score_change_6m} places={inactive ? null : athlete.places_up_6m} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rule flex flex-wrap justify-between items-center text-xs gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className="tabular-nums font-semibold text-ink">{rating}</span>
              <span>skill</span>
              <span className="text-[15px] leading-4 font-medium mx-1">−</span>
              <span className="tabular-nums font-semibold text-ink">{uncertainty}</span>
              <span>uncertainty</span>
              <span className="text-[15px] leading-4 font-medium mx-1">=</span>
              <span className="tabular-nums font-bold text-ink">{score}</span>
            </div>
            <Link href="/methodology" className="font-serif text-[14px] leading-4 font-semibold text-claret hover:underline">
              How it works
            </Link>
          </div>
        </div>
      </header>

    </>
  );
}

function ChangeRow({ label, score, places }: { label: string; score: number | null; places: number | null }) {
  const change = changeText(score);
  // no rank back then: nothing to compare (NEW is for the tables)
  const moved = places === null ? { text: "–", color: "" } : placesText(places);
  return (
    <div className="grid grid-cols-3 gap-4 py-0.5 items-center text-right">
      <span className="text-muted text-left">{label}</span>
      <span className={`font-bold text-sm ${change.color}`}>{change.text}</span>
      <span className={`font-medium text-sm ${moved.color}`}>{moved.text}</span>
    </div>
  );
}
