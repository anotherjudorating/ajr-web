"use client";

import { useState } from "react";

import { scrollWhileGrowing, useHash } from "@/components/anchors";
import { SECTION, targetOf } from "@/lib/anchors";
import { AthleteHeader } from "@/components/athlete/AthleteHeader";
import { type Highlight, standingOf } from "@/lib/standing";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Contests, type ContestsPreset } from "@/components/athlete/Contests";
import { FrequentOpponents, NextTournaments, Standouts } from "@/components/athlete/Lists";
import { Medals } from "@/components/athlete/Medals";
import { type Competition, RatingChart } from "@/components/athlete/RatingChart";
import type { Places } from "@/lib/places";
import { weightView } from "@/lib/weight-view";
import type { Athlete, AthleteChance, HistoryRow } from "@/lib/api";
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
  chances = [],
  today,
}: {
  athlete: Athlete;
  history: HistoryRow[];
  chances?: AthleteChance[]; // the tournaments still open, with their chances
  places: Places | null; // every Monday's, for the chart's tip (null without R2)
  today: string; // YYYY-MM-DD
}) {
  const [weight, setWeight] = useState(athlete.weight ?? athlete.weights[0] ?? null);
  // a point picked on the chart: its competitions' contests marked in the table
  const [marked, setMarked] = useState<{ ids: number[]; n: number } | null>(null);
  const contests = history.filter((contest) => contest.weight === weight);

  // a longest run picked in the header: shown on the Rank chart
  const [run, setRun] = useState<Highlight | null>(null);
  // a record of weeks (#rating-<kind>[-run]~<weight>: components/records/columns.tsx):
  // its weight, and its weeks (all of them, or its longest run) marked on the Rank chart
  const record = targetOf(useHash(), SECTION.rating);
  const [recordSeen, setRecordSeen] = useState<string | null>(null);
  if (record !== recordSeen) {
    setRecordSeen(record);
    // a week: the first at #1 (the age)
    const week = record?.match(/^first-1-(\d{4}-\d{2}-\d{2})-(\d+)(?:~(.+))?$/);
    if (week) {
      const [, day, age, of] = week;
      if (of && athlete.weights.includes(of)) setWeight(of);
      setRun({ spans: [{ from: day, to: day }], label: `First #1, at ${age}` });
    }
    const found = record?.match(/^(at-1|p4p-1|top-8)(-run)?(?:~(.+))?$/);
    if (found) {
      const [, kind, longest, of] = found;
      const at = of && athlete.weights.includes(of) ? of : weight;
      setWeight(at);
      const standing = standingOf(places, at, history);
      const weeks = standing && { "at-1": standing.atOne, "p4p-1": standing.p4pAtOne, "top-8": standing.top8 }[kind];
      const phrase = { "at-1": "at #1", "p4p-1": "at #1 pound for pound", "top-8": "in the top 8" }[kind];
      if (weeks && weeks.weeks > 0)
        setRun(
          longest
            ? { spans: [{ from: weeks.from!, to: weeks.to! }], label: `${weeks.longest} ${weeks.longest === 1 ? "week" : "weeks"} ${phrase}` }
            : { spans: weeks.spans, label: `${weeks.weeks} ${weeks.weeks === 1 ? "week" : "weeks"} ${phrase}` },
        );
    }
  }
  const pickWeight = (w: string) => {
    setRun(null);
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
    requestAnimationFrame(() => {
      const contests = document.getElementById("contests");
      if (contests) scrollWhileGrowing(contests);
    });
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
      <AthleteHeader athlete={{ ...athlete, ...weightView(athlete, weight, history, places) }} weight={weight} onWeight={pickWeight} today={today} inactive={inactive} standing={standingOf(places, weight, history)} run={run} onRun={setRun} />
      <RatingChart athlete={athlete} history={history} places={places} weight={weight} run={run} onRun={setRun} today={today} inactive={inactive} onPeriod={pickPeriod} />
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
        <NextTournaments athleteId={athlete.id} chances={chances} today={today} />
      </section>
    </>
  );
}
