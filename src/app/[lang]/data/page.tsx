import type { Metadata } from "next";
import { Suspense } from "react";

import { DATA_PROSE } from "@/content/data";
import { LICENSE, LINK } from "@/content/data/types";
import { i18n } from "@/i18n/server";
import { alternatesFor, SITE } from "@/lib/seo";
import { archive, type Archive } from "@/lib/tables";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await i18n();
  return {
    title: DATA_PROSE[lang].meta.title,
    description: DATA_PROSE[lang].meta.description,
    alternates: alternatesFor(lang, "/data"),
  };
}

const size = (bytes: number) =>
  bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`;

const README = "README.md"; // the archive's own file, named as it is
const H2 = "font-serif text-[22px] leading-[28px] font-bold text-ink mt-8 mb-2";

// The open-data archive the backend writes to R2 every week (ajr-backend ajr/tables):
// the files with their sizes and checksums from the manifest, the columns, the
// license. Without the manifest (R2 off, not written yet) the same text, no table.
// The text: src/content/data/<lang>.tsx.
// The manifest is cached minutes, not until the data changes: read inside the
// Suspense, so the page's shell stays static.
export default function DataPage() {
  return (
    <Suspense fallback={null}>
      <DataContent />
    </Suspense>
  );
}

async function DataContent() {
  const [data, { lang, f, t }] = await Promise.all([archive(), i18n()]);
  const prose = DATA_PROSE[lang];
  const updated = data?.files[0]?.updated_at.slice(0, 10);
  return (
    <div className="w-full max-w-[760px] bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[15px] leading-relaxed text-ink">
      {data && <DatasetData data={data} updated={updated} />}
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">{prose.title}</h1>
      <p className="mt-3">{prose.intro}</p>
      <p className="mt-3">{prose.rebuilt}</p>

      <h2 className={H2}>{prose.files}</h2>
      {data ? (
        <>
          {updated && <p className="text-[14px] text-muted mb-3">{t(prose.updated, { date: f.formatDate(updated) })}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b border-rule text-left text-muted">
                  <th className="py-2 pr-4 font-normal">{prose.file}</th>
                  <th className="py-2 pr-4 font-normal text-right">{prose.rows}</th>
                  <th className="py-2 font-normal text-right">{prose.size}</th>
                </tr>
              </thead>
              <tbody>
                {data.files.map((file) => (
                  <tr key={file.name} className="border-b border-rule align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <a href={file.url} className={LINK}>
                        {file.name}
                      </a>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums">{f.number(file.rows)}</td>
                    <td className="py-2 text-right tabular-nums whitespace-nowrap">{size(file.bytes)}</td>
                  </tr>
                ))}
                {data.readme && (
                  <tr className="border-b border-rule align-top">
                    <td className="py-2 pr-4">
                      <a href={data.readme} className={LINK}>
                        {README}
                      </a>
                    </td>
                    <td />
                    <td />
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-muted">{prose.preparing}</p>
      )}

      <h2 className={H2}>{prose.licenseTitle}</h2>
      <p>{prose.license}</p>
      <p className="mt-3">{prose.source}</p>
      <p className="mt-3">{prose.cite(SITE)}</p>
      <p className="mt-3">{prose.questions}</p>
    </div>
  );
}

// schema.org Dataset, for Google Dataset Search.
function DatasetData({ data, updated }: { data: Archive; updated?: string }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Another Judo Rating: rating history of IJF World Tour judoka",
    description:
      "Every rating change since 2009 for every IJF World Tour judoka: contest, athlete, opponent, day, weight, outcome, win probability, Glicko-2 rating, deviation and volatility before and after; with athletes and competitions to join on. Derived from results in IJF judobase.",
    url: `${SITE}/data`,
    license: LICENSE,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Another Judo Rating", url: SITE },
    isBasedOn: "https://judobase.ijf.org",
    version: data.version,
    ...(updated ? { dateModified: updated } : {}),
    temporalCoverage: `2009-01-01/${updated ?? ""}`,
    keywords: ["judo", "IJF", "Glicko-2", "ratings", "sports analytics"],
    distribution: data.files.map((file) => ({
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: file.url,
      contentSize: `${file.bytes}`,
    })),
    citation: `Another Judo Rating, rating history, version ${data.version}, ${SITE}/data`,
  };
  return (
    <script
      type="application/ld+json"
      // "<" escaped, so that a name cannot close the script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
