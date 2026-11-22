import type { Metadata } from "next";

import { RecordsOverview } from "@/components/records/RecordsOverview";
import { records } from "@/lib/api";
import { i18n } from "@/i18n/server";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, d } = await i18n();
  return {
    title: d.records.meta.title,
    description: d.records.meta.description,
    alternates: alternatesFor(lang, "/records"),
  };
}

// The top 5 of every record for all, men and women: the Men/Women filter switches
// between them in the browser.
export default async function RecordsPage() {
  const [all, men, women, { d }] = await Promise.all([records(5), records(5, "male"), records(5, "female"), i18n()]);
  // the lead around its link to the IJF database
  const [leadBefore, leadAfter] = d.records.lead.split("{judobase}");
  return (
    <div className="w-full bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8">
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        {d.records.title}
      </h1>
      <p className="mt-1.5 text-[14px] text-muted">
        {leadBefore}
        <a
          href="https://judobase.ijf.org/#/dashboard"
          target="_blank"
          rel="noopener"
          className="underline hover:text-ink"
        >
          {d.records.judobase}
        </a>
        {leadAfter}
      </p>
      <RecordsOverview rows={{ "": all, male: men, female: women }} />
    </div>
  );
}
