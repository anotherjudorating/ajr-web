import type { Metadata } from "next";
import { currentLang } from "@/i18n/server";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact",
    description: "How to reach Another Judo Rating: questions, corrections and ideas by email, bugs and wrong results on GitHub.",
    alternates: alternatesFor(await currentLang(), "/contact"),
  };
}

const EMAIL = "info@anotherjudorating.com";
const DATA = "data@anotherjudorating.com";
const ISSUES = "https://github.com/anotherjudorating/ajr-web/issues";
const LINK = "underline hover:text-ink";

// Who to write to: one address for everything, the issue tracker for what can be
// checked in public, the dataset's own address (infra/email.tf routes both).
export default function ContactPage() {
  return (
    <div className="w-full max-w-[760px] bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[15px] leading-relaxed text-ink">
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">Contact</h1>
      <p className="mt-3">
        Questions, corrections and ideas:{" "}
        <a href={`mailto:${EMAIL}`} className={LINK}>
          {EMAIL}
        </a>
        .
      </p>
      <p className="mt-3">
        A wrong result, a missing contest, two athletes merged into one, or a bug on the site:{" "}
        <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
          open an issue on GitHub
        </a>
        , with a link to the page.
      </p>
      <p className="mt-3">
        The dataset, its license and removal requests:{" "}
        <a href={`mailto:${DATA}`} className={LINK}>
          {DATA}
        </a>
        .
      </p>
    </div>
  );
}
