import Link from "@/components/Link";

import { i18n } from "@/i18n/server";
import { lastUpdate } from "@/lib/api";

const GITHUB = "https://github.com/anotherjudorating";

// GitHub's mark, in the text's colour.
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export async function Footer() {
  const [updated, { d, f, t }] = await Promise.all([lastUpdate(), i18n()]);
  return (
    <footer className="w-full bg-paper border-t border-rule mt-10 md:mt-12 lg:mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0 sm:h-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        {/* mobile: Methodology and Data first; desktop: on the right */}
        <div className="sm:hidden flex gap-4 text-[13px] text-ink">
          <Link href="/methodology" className="hover:underline">
            {d.site.footer.methodology}
          </Link>
          <Link href="/data" className="hover:underline">
            {d.site.footer.exportData}
          </Link>
          <Link href="/contact" className="hover:underline">
            {d.site.footer.contact}
          </Link>
        </div>
        <div className="flex items-center text-[12px] text-muted whitespace-nowrap mt-2 sm:mt-0">
          {updated && <span>{t(d.site.footer.updated, { date: f.formatDate(updated) })}</span>}
          {updated && <span className="inline-block w-px h-3 bg-rule mx-2 align-middle" />}
          <span>
            {d.site.footer.source}{" "}
            <a
              href="https://judobase.ijf.org/#/dashboard"
              target="_blank"
              rel="noopener"
              className="hover:text-ink hover:underline"
            >
              {d.site.footer.judobase}
            </a>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[12px] text-muted">
          <Link href="/methodology" className="hover:text-ink hover:underline">
            {d.site.footer.methodology}
          </Link>
          <Link href="/data" className="hover:text-ink hover:underline">
            {d.site.footer.exportData}
          </Link>
          <Link href="/contact" className="hover:text-ink hover:underline">
            {d.site.footer.contact}
          </Link>
          <a href={GITHUB} target="_blank" rel="noopener" aria-label={d.site.footer.github} title={d.site.footer.github} className="text-muted hover:text-ink">
            <GitHubMark />
          </a>
        </div>
      </div>
    </footer>
  );
}
