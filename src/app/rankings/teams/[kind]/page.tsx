import type { Metadata } from "next";

import { NotBuilt } from "@/components/ErrorPage";
import { WeightSwitcher } from "@/components/WeightSwitcher";

export const metadata: Metadata = { title: "Team rankings", robots: { index: false } };

export function generateStaticParams() {
  return [{ kind: "men" }, { kind: "women" }, { kind: "mixed" }];
}

// Team events are not rated yet: that is a model of its own.
export default async function Page({ params }: PageProps<"/rankings/teams/[kind]">) {
  const { kind } = await params;
  return (
    <div className="w-full pt-6 sm:pt-8 pb-8">
      <WeightSwitcher current={`/rankings/teams/${kind}`} />
      <NotBuilt section="The team ranking" compact />
    </div>
  );
}
