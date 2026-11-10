"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Children, cloneElement, isValidElement } from "react";

// A table row that opens a page (a contest) on a click anywhere in it; a link inside
// the row (an athlete's name) still opens its own page, and Cmd/Ctrl or the middle
// button opens the row's page in a new tab. The first cell holds a real link to it,
// out of sight: search engines follow it, and the keyboard reaches the row by it.
export function RowLink({ href, label = "Open", className = "", id, children }: {
  href: string;
  id?: string; // an anchor on the row
  label?: string; // the hidden link's text
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const cells = Children.toArray(children);
  const first = cells.findIndex((child) => isValidElement(child) && child.type === "td");
  if (first >= 0) {
    const child = cells[first] as React.ReactElement<{ children?: React.ReactNode }>;
    cells[first] = cloneElement(child, {}, (
      <>
        <Link href={href} className="sr-only">
          {label}
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
        if (e.metaKey || e.ctrlKey) window.open(href, "_blank");
        else router.push(href);
      }}
      onAuxClick={(e) => {
        if (e.button === 1 && !inLink(e.target)) window.open(href, "_blank");
      }}
      className={`cursor-pointer has-[>td>a.sr-only:focus-visible]:outline-2 has-[>td>a.sr-only:focus-visible]:outline-claret ${className}`}
    >
      {cells}
    </tr>
  );
}
