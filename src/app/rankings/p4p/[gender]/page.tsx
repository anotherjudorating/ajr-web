import type { Metadata } from "next";

import { NotBuilt } from "@/components/ErrorPage";
import { WeightSwitcher } from "@/components/WeightSwitcher";

export const metadata: Metadata = { title: "Pound-for-pound", robots: { index: false } };

export function generateStaticParams() {
  return [{ gender: "men" }, { gender: "women" }];
}

// Every weight of one gender in one table: not built yet.
export default async function Page({ params }: PageProps<"/rankings/p4p/[gender]">) {
  const { gender } = await params;
  return (
    <div className="w-full pt-6 sm:pt-8 pb-8">
      <WeightSwitcher current={`/rankings/p4p/${gender}`} />
      <NotBuilt section="The pound-for-pound ranking" compact />
    </div>
  );
}
