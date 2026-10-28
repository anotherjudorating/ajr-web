"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { label: "Rankings", href: "/rankings" },
  { label: "Methodology", href: "/methodology" },
];

// The current section is claret (and underlined on desktop).
export function NavLinks({ variant }: { variant: "desktop" | "mobile" }) {
  const pathname = usePathname();
  return SECTIONS.map(({ label, href }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    const className =
      variant === "desktop"
        ? `h-full inline-flex items-center text-[15px] border-b-2 -mb-px ${
            active ? "text-claret border-claret" : "text-muted hover:text-ink border-transparent"
          }`
        : active
          ? "text-claret"
          : "text-muted";
    return (
      <Link key={href} href={href} className={className}>
        {label}
      </Link>
    );
  });
}
