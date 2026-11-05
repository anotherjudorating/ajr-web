import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ContestView } from "@/components/contest/ContestView";
import { contest, contestContext } from "@/lib/api";
import { shortName } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/contests/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const found = Number.isInteger(id) ? await contest(id) : null;
  if (!found) return {};
  const names = `${shortName(found.white_family_name, found.white_given_name)} vs ${shortName(found.blue_family_name, found.blue_given_name)}`;
  return { title: `${names} — ${found.round ?? "contest"}, ${found.competition}` };
}

export default function ContestPage({ params }: PageProps<"/contests/[id]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Contest params={params} />
      </Suspense>
    </div>
  );
}

async function Contest({ params }: { params: PageProps<"/contests/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const found = await contest(id);
  if (!found || !found.white_id || !found.blue_id) notFound();
  // the parts of both histories the page shows (not the whole histories)
  const rows = await contestContext(id);
  const side = (name: "white" | "blue") => {
    const seen = new Set<number>();
    return rows.filter((row) => row.side === name && !seen.has(row.contest_id) && seen.add(row.contest_id));
  };
  return <ContestView contest={found} whiteHistory={side("white")} blueHistory={side("blue")} />;
}
