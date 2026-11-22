import { Suspense } from "react";

import { CurrentExploreTabs, ExploreTabs } from "@/components/explore/ExploreTabs";

// The Explore tabs stay on screen while moving between the lists.
export default function ExploreLayout({ children }: LayoutProps<"/explore">) {
  return (
    <div className="w-full bg-paper pt-[27.25px] sm:pt-8 pb-8">
      <Suspense fallback={<ExploreTabs current="" />}>
        <CurrentExploreTabs />
      </Suspense>
      {children}
    </div>
  );
}
