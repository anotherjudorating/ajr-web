import Link from "next/link";

import { lastUpdate } from "@/lib/api";
import { formatDate } from "@/lib/format";

export async function Footer() {
  const updated = await lastUpdate();
  return (
    <footer className="w-full border-t border-rule mt-10 md:mt-12 lg:mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0 sm:h-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center text-[12px] text-muted whitespace-nowrap">
          {updated && <span>Ratings updated {formatDate(updated)}</span>}
          {updated && <span className="inline-block w-px h-3 bg-rule mx-2" />}
          <span>Data: IJF judobase</span>
        </div>
        <Link href="/methodology" className="text-[12px] text-muted hover:text-ink hover:underline">
          Methodology
        </Link>
      </div>
    </footer>
  );
}
