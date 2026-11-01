import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ContestView } from "@/components/contest/ContestView";
import { athleteHistory, contest } from "@/lib/api";
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
  const [whiteHistory, blueHistory] = await Promise.all([
    athleteHistory(found.white_id),
    athleteHistory(found.blue_id),
  ]);
  return <ContestView contest={found} whiteHistory={whiteHistory} blueHistory={blueHistory} />;
}
