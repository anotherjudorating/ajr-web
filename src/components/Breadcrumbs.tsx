"use client";

import { Fragment } from "react";

import Link from "@/components/Link";
import { useDict, useLang } from "@/i18n/client";
import { DEFAULT_LANG, localePath } from "@/i18n/locales";
import { SITE } from "@/lib/seo";

type Trail = { href?: string; label: string }[]; // without href: a page not built yet

// "Rankings › Men −73 kg › Heydarov H.": the way up, then the page itself.
export function Breadcrumbs({ trail, current, className = "" }: {
  trail: Trail;
  current: string;
  className?: string;
}) {
  const d = useDict();
  return (
    <nav aria-label={d.site.breadcrumbs.label} className={`text-[12px] text-muted flex flex-wrap items-center gap-1.5 ${className}`}>
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

// The same way up for search engines (schema.org BreadcrumbList), from the home page,
// with the page's language in the addresses. Pages whose switcher or tabs stand for the
// trail have it without the visible one.
export function BreadcrumbData({ trail, current }: { trail: Trail; current: string }) {
  const d = useDict();
  const lang = useLang();
  const home = lang === DEFAULT_LANG ? "" : localePath(lang, "/");
  const items = [{ href: "/", label: d.site.breadcrumbs.home }, ...trail.filter((t) => t.href), { label: current }];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ href, label }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: label,
      ...(href ? { item: `${SITE}${href === "/" ? home : localePath(lang, href)}` } : {}),
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
