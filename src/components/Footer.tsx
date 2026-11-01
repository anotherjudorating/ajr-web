import Link from "next/link";

import { lastUpdate } from "@/lib/api";
import { formatDate } from "@/lib/format";

export async function Footer() {
  const updated = await lastUpdate();
  return (
    <footer className="w-full bg-paper border-t border-rule mt-10 md:mt-12 lg:mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0 sm:h-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        {/* mobile: Methodology first; desktop: on the right */}
        <Link href="/methodology" className="sm:hidden text-[13px] text-ink hover:underline">
          Methodology
        </Link>
        <div className="flex items-center text-[12px] text-muted whitespace-nowrap mt-2 sm:mt-0">
          {updated && <span>Ratings updated {formatDate(updated)}</span>}
          {updated && <span className="inline-block w-px h-3 bg-rule mx-2 align-middle" />}
          <span>
            Data:{" "}
            <a
              href="https://judobase.ijf.org/#/dashboard"
              target="_blank"
              rel="noopener"
              className="hover:text-ink hover:underline"
            >
              IJF judobase
            </a>
          </span>
        </div>
        <Link
          href="/methodology"
          className="hidden sm:inline-block text-[12px] text-muted hover:text-ink hover:underline"
        >
          Methodology
        </Link>
      </div>
    </footer>
  );
}
