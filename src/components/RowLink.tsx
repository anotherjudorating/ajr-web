"use client";

import Link from "@/components/Link";
import { useDict } from "@/i18n/client";
import { useLocalePath, useRouter } from "@/i18n/navigation";
import { Children, cloneElement, isValidElement } from "react";

// A table row that opens a page (a contest) on a click anywhere in it; a link inside
// the row (an athlete's name) still opens its own page, and Cmd/Ctrl or the middle
// button opens the row's page in a new tab. The first cell holds a real link to it,
// out of sight: search engines follow it, and the keyboard reaches the row by it.
export function RowLink({ href, label, className = "", id, children }: {
  href: string;
  id?: string; // an anchor on the row
  label?: string; // the hidden link's text ("Open" without one)
  className?: string;
  children: React.ReactNode;
}) {
  const d = useDict();
  const router = useRouter();
  const p = useLocalePath();
  const cells = Children.toArray(children);
  const first = cells.findIndex((child) => isValidElement(child) && child.type === "td");
  if (first >= 0) {
    const child = cells[first] as React.ReactElement<{ children?: React.ReactNode }>;
    cells[first] = cloneElement(child, {}, (
      <>
        <Link href={href} className="sr-only">
          {label ?? d.site.rowLink.open}
        </Link>
        {child.props.children}
      </>
    ));
  }
  const inLink = (target: EventTarget) => (target as HTMLElement).closest("a") !== null;
  return (
    <tr
      id={id}
      onClick={(e) => {
        if (inLink(e.target)) return;
        if (e.metaKey || e.ctrlKey) window.open(p(href), "_blank");
        else router.push(href);
      }}
      onAuxClick={(e) => {
        if (e.button === 1 && !inLink(e.target)) window.open(p(href), "_blank");
      }}
      className={`group cursor-pointer has-[>td>a.sr-only:focus-visible]:outline-2 has-[>td>a.sr-only:focus-visible]:outline-claret ${className}`}
    >
      {cells}
    </tr>
  );
}
