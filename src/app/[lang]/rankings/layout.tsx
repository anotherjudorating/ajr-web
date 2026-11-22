import { Suspense } from "react";

import { CurrentWeightSwitcher } from "@/components/CurrentWeightSwitcher";
import { WeightSwitcher } from "@/components/WeightSwitcher";

// The weight switcher stays on screen while moving between the tables (weights,
// pound for pound, nations): only the table below changes.
export default function RankingsLayout({ children }: LayoutProps<"/rankings">) {
  return (
    <div className="w-full bg-paper pt-6 sm:pt-8 pb-8">
      <Suspense fallback={<WeightSwitcher current="" />}>
        <CurrentWeightSwitcher />
      </Suspense>
      {children}
    </div>
  );
}
