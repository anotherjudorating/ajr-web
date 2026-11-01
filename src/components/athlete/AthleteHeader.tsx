"use client";

import Link from "next/link";

import { Flag } from "@/components/Flag";
import { changeText, ijfDifference, placesText } from "@/components/rankings/Changes";
import type { Athlete } from "@/lib/api";
import { fullName, monthYear } from "@/lib/format";

const LABEL = "text-xs uppercase tracking-wider text-muted font-semibold";
const BIG = "font-serif text-[28px] leading-tight font-bold text-ink";

// Name, weights, places and the rating with its parts.
export function AthleteHeader({
  athlete,
  weight,
  onWeight,
  today,
}: {
  athlete: Athlete;
  weight: string | null;
  onWeight: (weight: string) => void;
  today: string;
}) {
  const age = athlete.birth_year ? Number(today.slice(0, 4)) - athlete.birth_year : null;
  const rating = athlete.rating ?? 0;
  const uncertainty = rating - (athlete.score ?? 0); // 3 × RD, rounded as the score is

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
            <Flag ioc={athlete.country} className="mr-2" />
            <span>{athlete.country_name ?? athlete.country}</span>
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
              <span className={`${BIG} mt-1`}>{athlete.place ? `#${athlete.place}` : "–"}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className={LABEL}>Peak</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={BIG}>{athlete.peak_place ? `#${athlete.peak_place}` : "–"}</span>
                {athlete.peak_score !== null && athlete.peak_on && (
                  <div className="leading-tight flex flex-col">
                    <span className="text-xs font-semibold text-ink tabular-nums">{athlete.peak_score}</span>
                    <span className="text-xs text-muted">{monthYear(athlete.peak_on)}</span>
                  </div>
                )}
              </div>
            </div>
            <div
              className="flex flex-col items-start"
              title="Position in the IJF World Ranking List. ↑ higher in IJF than in AJR, ↓ lower."
            >
              <span className={LABEL}>IJF</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={BIG}>{athlete.wrl_place ? `#${athlete.wrl_place}` : "–"}</span>
                {athlete.place && athlete.wrl_place && (
                  <span className="text-xs text-muted">{ijfDifference(athlete.place, athlete.wrl_place)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-end gap-4">
            <div className="flex flex-col">
              <div className="font-serif text-[56px] leading-none font-bold text-ink tabular-nums">{athlete.score}</div>
              <span className={`${LABEL} mt-2`}>Current rating</span>
            </div>
            <div className="tabular-nums text-xs pb-1">
              <div className="grid grid-cols-3 gap-4 pb-1 text-[11px] uppercase tracking-wider text-muted font-semibold text-right">
                <span className="text-left">Change</span>
                <span>Rating</span>
                <span>Rank</span>
              </div>
              <ChangeRow label="90 days" score={athlete.score_change_90d} places={athlete.places_up_90d} />
              <ChangeRow label="6 months" score={athlete.score_change_6m} places={athlete.places_up_6m} />
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
              <span className="tabular-nums font-bold text-ink">{athlete.score}</span>
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
