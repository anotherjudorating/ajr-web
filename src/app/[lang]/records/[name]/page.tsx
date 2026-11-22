import type { Metadata } from "next";
import Link from "@/components/Link";
import { notFound } from "next/navigation";
import { permanentRedirectTo } from "@/i18n/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecordBrowser } from "@/components/records/RecordBrowser";
import { recordText, viewText } from "@/components/records/text";
import { i18n } from "@/i18n/server";
import { record } from "@/lib/api";
import { MOVED, recordBySlug, RECORDS, recordView } from "@/lib/records";
import { weightBySlug } from "@/lib/weights";
import { alternatesFor, hasParams, NOINDEX } from "@/lib/seo";

export function generateStaticParams() {
  return RECORDS.map((r) => ({ name: r.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps<"/[lang]/records/[name]">): Promise<Metadata> {
  const slug = (await params).name;
  if (MOVED[slug]) await permanentRedirectTo(`/records/${MOVED[slug]}`); // a record renamed or dropped
  const info = recordBySlug(slug);
  if (!info) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const filtered = hasParams(await searchParams); // a gender or weight picked
  const { lang, d, t } = await i18n();
  const text = recordText(d, info);
  const metadata = {
    title: t(d.records.pageTitle, { title: text.title }),
    description: text.description,
    alternates: alternatesFor(lang, `/records/${slug}`, { indexed: !filtered }),
  };
  return filtered ? { ...metadata, robots: NOINDEX } : metadata;
}

export default function RecordPage({ params, searchParams }: PageProps<"/[lang]/records/[name]">) {
  return (
    <div className="w-full bg-paper pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px] pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Record params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Record({ params, searchParams }: PageProps<"/[lang]/records/[name]">) {
  const slug = (await params).name;
  if (MOVED[slug]) await permanentRedirectTo(`/records/${MOVED[slug]}`);
  const info = recordBySlug(slug);
  if (!info) notFound();
  const query = await searchParams;
  const view = recordView(info, typeof query.view === "string" ? query.view : undefined);
  const { d } = await i18n();
  const text = recordText(d, info);

  return (
    <>
      <Breadcrumbs
        trail={[
          { href: "/records", label: d.records.title },
          { href: `/records#${info.group}`, label: d.records.groups[info.group] },
        ]}
        current={text.title}
      />
      <h1 className="font-serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        {text.title}
      </h1>
      <p className="mt-1.5 text-[14px] text-muted max-w-3xl">
        {viewText(d, info, view).description}
        {info.methodology && (
          <>
            {" "}
            <Link href="/methodology" className="font-serif font-semibold text-claret hover:underline whitespace-nowrap">
              {d.records.howRatingsWork}
            </Link>
          </>
        )}
      </p>
      <Suspense fallback={<RecordBrowser loading info={info} view={view} rows={[]} gender="" weight="" />}>
        <Rows slug={info.slug} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

// The rows depend on the filters in the URL (?gender=women, ?weight=women-52).
async function Rows({ slug, searchParams }: { slug: string; searchParams: PageProps<"/[lang]/records/[name]">["searchParams"] }) {
  const info = recordBySlug(slug)!;
  const query = await searchParams;
  const view = recordView(info, typeof query.view === "string" ? query.view : undefined);
  const weight = typeof query.weight === "string" && info.weights ? weightBySlug(query.weight) : undefined;
  const gender = weight?.gender ?? (query.gender === "men" || query.gender === "women" ? query.gender : "");
  const rows = await record(
    view.name,
    gender === "men" ? "male" : gender === "women" ? "female" : undefined,
    weight?.api,
  );
  return (
    <RecordBrowser
      key={`${view.key}-${gender}-${weight?.slug}`}
      info={info}
      view={view}
      rows={rows}
      gender={gender}
      weight={weight?.slug ?? ""}
    />
  );
}
