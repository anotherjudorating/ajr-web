import type { Metadata } from "next";

import { CONTACT_PROSE } from "@/content/contact";
import { currentLang } from "@/i18n/server";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await currentLang();
  return {
    title: CONTACT_PROSE[lang].meta.title,
    description: CONTACT_PROSE[lang].meta.description,
    alternates: alternatesFor(lang, "/contact"),
  };
}

// Who to write to: one address for everything, the issue tracker for what can be
// checked in public, the dataset's own address (infra/email.tf routes both). The text:
// src/content/contact/<lang>.tsx.
export default async function ContactPage() {
  const prose = CONTACT_PROSE[await currentLang()];
  return (
    <div className="w-full max-w-[760px] bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[15px] leading-relaxed text-ink">
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">{prose.title}</h1>
      <p className="mt-3">{prose.questions}</p>
      <p className="mt-3">{prose.issues}</p>
      <p className="mt-3">{prose.dataset}</p>
    </div>
  );
}
