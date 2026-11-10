"use client";

import { useState } from "react";

import { AthleteHeader } from "@/components/athlete/AthleteHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Contests, type ContestsPreset } from "@/components/athlete/Contests";
import { FrequentOpponents, NextTournaments, Standouts } from "@/components/athlete/Lists";
import { Medals } from "@/components/athlete/Medals";
import { type Competition, RatingChart } from "@/components/athlete/RatingChart";
import type { Places } from "@/lib/places";
import { weightView } from "@/lib/weight-view";
import type { Athlete, HistoryRow } from "@/lib/api";
import { shortName } from "@/lib/format";
import { lastRating } from "@/lib/inactive";
import { WEIGHTS } from "@/lib/weights";

// The athlete page. The weight tabs set the contests' weight filter (the list has its
// own, with "All weights"), pick the lists below and the header's place, changes and
// peak (lib/weight-view.ts); the rating is one for all weights, so its numbers and the
// chart stay the same.
export function AthleteView({
  athlete,
  history,
  places,
  today,
}: {
  athlete: Athlete;
  history: HistoryRow[];
  places: Places | null; // every Monday's, for the chart's tip (null without R2)
  today: string; // YYYY-MM-DD
}) {
  const [weight, setWeight] = useState(athlete.weight ?? athlete.weights[0] ?? null);
  // a point picked on the chart: its competitions' contests marked in the table
  const [marked, setMarked] = useState<{ ids: number[]; n: number } | null>(null);
  const contests = history.filter((contest) => contest.weight === weight);

  const pickWeight = (w: string) => {
    setWeight(w);
    setMarked(null);
    setPreset(null);
  };
  const pickPeriod = (picked: Competition[]) => {
    // the table's weight: the one shown when a competition was in it, else theirs
    const at = picked.some((c) => c.weight === weight) ? weight : picked[0].weight;
    if (at && at !== weight) setWeight(at);
    setMarked((m) => ({ ids: picked.map((c) => c.id), n: (m?.n ?? 0) + 1 }));
  };
  // Best wins / Toughest losses → All: the contests list with those filters
  const [preset, setPreset] = useState<{ value: ContestsPreset; n: number } | null>(null);
  const showAll = (kind: "wins" | "losses") => {
    setMarked(null);
    setPreset((p) => ({
      value: kind === "wins" ? { result: "w", sort: "chance-asc" } : { result: "l", sort: "chance-desc" },
      n: (p?.n ?? 0) + 1,
    }));
    requestAnimationFrame(() => document.getElementById("contests")?.scrollIntoView({ behavior: "smooth" }));
  };
  const current = WEIGHTS.find((w) => w.api === athlete.weight);
  const inactive = lastRating(history, today);

  return (
    <>
      <Breadcrumbs
        className="mb-4 pt-2 sm:pt-0"
        trail={[
          { href: "/rankings", label: "Rankings" },
          ...(current
            ? [{ href: `/rankings/${current.slug}`, label: `${current.gender === "men" ? "Men" : "Women"} ${current.label} kg` }]
            : []),
        ]}
        current={shortName(athlete.family_name, athlete.given_name)}
      />

      {/* the place, the changes and the peak of the picked weight */}
      <AthleteHeader athlete={{ ...athlete, ...weightView(athlete, weight, history, places) }} weight={weight} onWeight={pickWeight} today={today} inactive={inactive} />
      <RatingChart athlete={athlete} history={history} places={places} today={today} inactive={inactive} onPeriod={pickPeriod} />
      <Medals history={history} />
      <Contests
        key={`${weight}-${preset?.n ?? 0}`}
        preset={preset?.value}
        contests={history}
        weights={athlete.weights}
        weight={weight}
        mark={marked}
        fileName={`ajr-${athlete.id}-${weight ?? "all"}.csv`}
      />
      <Standouts contests={contests} onAll={showAll} />
      <section className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-24 gap-y-14">
        <FrequentOpponents athleteId={athlete.id} contests={contests} />
        <NextTournaments />
      </section>
    </>
  );
}
