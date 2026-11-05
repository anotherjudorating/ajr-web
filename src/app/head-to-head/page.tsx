import type { Metadata } from "next";
import { Suspense } from "react";

import { Comparison } from "@/components/h2h/Comparison";
import { H2HBrowser } from "@/components/h2h/H2HBrowser";
import { athlete, athleteHistory, lastUpdate } from "@/lib/api";
import type { Picked } from "@/lib/h2h";
import { popularMatchups } from "@/lib/matchups";
import { WEIGHTS } from "@/lib/weights";
import { hasParams, NOINDEX } from "@/lib/seo";

const METADATA: Metadata = {
  title: "Head-to-head — judo ratings compared",
  description: "Compare two judoka: ratings, win chance and every meeting.",
};

// The form is indexed; a pair (?a=&b=) is one of millions: not indexed.
export async function generateMetadata({ searchParams }: PageProps<"/head-to-head">): Promise<Metadata> {
  return hasParams(await searchParams) ? { ...METADATA, robots: NOINDEX } : METADATA;
}

export default function Page({ searchParams }: PageProps<"/head-to-head">) {
  return (
    <div className="w-full bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8">
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        Head-to-head
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">Compare two athletes: ratings, win chance and every meeting.</p>
      <Suspense fallback={<H2HBrowser weight={null} a={null} b={null} popular={[]} result={null} />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// "?w=men-73&a=13028&b=18842": the weight and the two athletes.
async function Content({ searchParams }: { searchParams: PageProps<"/head-to-head">["searchParams"] }) {
  const query = await searchParams;
  const id = (key: string) => {
    const value = Number(query[key]);
    return Number.isInteger(value) && value > 0 ? value : null;
  };
  const [idA, idB] = [id("a"), id("b")];
  const [athleteA, athleteB, historyA, historyB, updated, popular] = await Promise.all([
    idA ? athlete(idA) : null,
    idB ? athlete(idB) : null,
    idA ? athleteHistory(idA) : [],
    idB ? athleteHistory(idB) : [],
    lastUpdate(),
    popularMatchups(),
  ]);
  const today = (updated ?? "1970-01-01").slice(0, 10);
  const slug = typeof query.w === "string" && WEIGHTS.some((w) => w.slug === query.w) ? query.w : null;
  const weight = slug ?? WEIGHTS.find((w) => w.api === athleteA?.weight)?.slug ?? null;

  const result =
    athleteA && athleteB ? (
      <Comparison a={{ athlete: athleteA, history: historyA }} b={{ athlete: athleteB, history: historyB }} today={today} />
    ) : null;

  return <H2HBrowser weight={weight} a={picked(athleteA)} b={picked(athleteB)} popular={popular} result={result} />;
}

function picked(found: Awaited<ReturnType<typeof athlete>>): Picked | null {
  if (!found) return null;
  return {
    id: found.id,
    family_name: found.family_name,
    given_name: found.given_name,
    country: found.country,
    score: found.score,
  };
}
