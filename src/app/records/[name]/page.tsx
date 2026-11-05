import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecordBrowser } from "@/components/records/RecordBrowser";
import { record } from "@/lib/api";
import { GROUPS, recordBySlug, RECORDS } from "@/lib/records";
import { weightBySlug } from "@/lib/weights";
import { hasParams, NOINDEX } from "@/lib/seo";

export function generateStaticParams() {
  return RECORDS.map((r) => ({ name: r.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps<"/records/[name]">): Promise<Metadata> {
  const info = recordBySlug((await params).name);
  if (!info) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const metadata = { title: `${info.title} — judo records`, description: `${info.description} Since 2009, from IJF contest data.` };
  return hasParams(await searchParams) ? { ...metadata, robots: NOINDEX } : metadata; // a gender or weight picked
}

export default function RecordPage({ params, searchParams }: PageProps<"/records/[name]">) {
  return (
    <div className="w-full bg-paper pt-[33.25px] sm:pt-[41.25px] md:pt-[42.75px] pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Record params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Record({ params, searchParams }: PageProps<"/records/[name]">) {
  const info = recordBySlug((await params).name);
  if (!info) notFound();
  const group = GROUPS.find((g) => g.key === info.group)!;

  return (
    <>
      <Breadcrumbs
        trail={[
          { href: "/records", label: "Records" },
          { href: `/records#${group.key}`, label: group.title },
        ]}
        current={info.title}
      />
      <h1 className="font-serif mt-3 text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        {info.title}
      </h1>
      <p className="mt-1.5 text-[14px] text-muted max-w-3xl">
        {info.description}
        {info.methodology && (
          <>
            {" "}
            <Link href="/methodology" className="font-serif font-semibold text-claret hover:underline whitespace-nowrap">
              How ratings work
            </Link>
          </>
        )}
      </p>
      <Suspense fallback={<RecordBrowser loading info={info} rows={[]} gender="" weight="" />}>
        <Rows slug={info.slug} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

// The rows depend on the filters in the URL (?gender=women, ?weight=women-52).
async function Rows({ slug, searchParams }: { slug: string; searchParams: PageProps<"/records/[name]">["searchParams"] }) {
  const info = recordBySlug(slug)!;
  const query = await searchParams;
  const weight = typeof query.weight === "string" && info.weights ? weightBySlug(query.weight) : undefined;
  const gender = weight?.gender ?? (query.gender === "men" || query.gender === "women" ? query.gender : "");
  const rows = await record(
    info.name,
    gender === "men" ? "male" : gender === "women" ? "female" : undefined,
    weight?.api,
  );
  return (
    <RecordBrowser
      key={`${gender}-${weight?.slug}`}
      info={info}
      rows={rows}
      gender={gender}
      weight={weight?.slug ?? ""}
    />
  );
}
