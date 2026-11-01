"use client";

import { useRouter } from "next/navigation";

// A table row that opens a page (a contest) on a click anywhere in it; a link inside
// the row (an athlete's name) still opens its own page.
export function RowLink({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <tr
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        router.push(href);
      }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </tr>
  );
}
