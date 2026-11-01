import type { Metadata } from "next";

import { RecordsOverview } from "@/components/records/RecordsOverview";
import { records } from "@/lib/api";

export const metadata: Metadata = {
  title: "Records",
  description: "All-time judo records: highest ratings, longest reigns at #1, most medals, biggest upsets and more.",
};

// The top 5 of every record for all, men and women: the Men/Women filter switches
// between them in the browser.
export default async function RecordsPage() {
  const [all, men, women] = await Promise.all([records(5), records(5, "male"), records(5, "female")]);
  return (
    <div className="w-full bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8">
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        Records
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">
        All-time bests, based only on contests available in the{" "}
        <a
          href="https://judobase.ijf.org/#/dashboard"
          target="_blank"
          rel="noopener"
          className="underline hover:text-ink"
        >
          IJF judobase
        </a>
        : from 2009, and from 2011 for the records that rest on ratings, once they had settled.
      </p>
      <RecordsOverview rows={{ "": all, male: men, female: women }} />
    </div>
  );
}
