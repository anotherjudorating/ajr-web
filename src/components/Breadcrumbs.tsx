import Link from "next/link";
import { Fragment } from "react";

import { SITE } from "@/lib/seo";

type Trail = { href?: string; label: string }[]; // without href: a page not built yet

// "Rankings › Men −73 kg › Heydarov H.": the way up, then the page itself.
export function Breadcrumbs({ trail, current, className = "" }: {
  trail: Trail;
  current: string;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`text-[12px] text-muted flex flex-wrap items-center gap-1.5 ${className}`}>
      <BreadcrumbData trail={trail} current={current} />
      {trail.map(({ href, label }) => (
        <Fragment key={label}>
          {href ? (
            <Link href={href} className="hover:text-ink transition-colors">
              {label}
            </Link>
          ) : (
            <span>{label}</span>
          )}
          <span className="text-rule">›</span>
        </Fragment>
      ))}
      <span className="text-ink font-medium">{current}</span>
    </nav>
  );
}

// The same way up for search engines (schema.org BreadcrumbList), from the home page.
// Pages whose switcher or tabs stand for the trail have it without the visible one.
export function BreadcrumbData({ trail, current }: { trail: Trail; current: string }) {
  const items = [{ href: "/", label: "Home" }, ...trail.filter((t) => t.href), { label: current }];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ href, label }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      ...(href ? { item: `${SITE}${href === "/" ? "" : href}` } : {}),
    })),
  };
  return (
    <script
      type="application/ld+json"
      // "<" escaped, so that a name cannot close the script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
