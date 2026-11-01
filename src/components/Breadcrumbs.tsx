import Link from "next/link";
import { Fragment } from "react";

// "Rankings › Men −73 kg › Heydarov H.": the way up, then the page itself.
export function Breadcrumbs({ trail, current, className = "" }: {
  trail: { href: string; label: string }[];
  current: string;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[12px] text-muted flex flex-wrap items-center gap-1.5 ${className}`}>
      {trail.map(({ href, label }) => (
        <Fragment key={href}>
          <Link href={href} className="hover:text-ink transition-colors">
            {label}
          </Link>
          <span>›</span>
        </Fragment>
      ))}
      <span className="text-ink font-medium">{current}</span>
    </nav>
  );
}
