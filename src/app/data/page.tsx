import type { Metadata } from "next";
import { Suspense } from "react";

import { formatDate } from "@/lib/format";
import { SITE } from "@/lib/seo";
import { archive, type Archive } from "@/lib/tables";

export const metadata: Metadata = {
  title: "Data",
  description:
    "Download the full rating history of every IJF World Tour judoka as CSV: every contest since 2009 with win chances and ratings before and after. CC BY 4.0.",
};

const LICENSE = "https://creativecommons.org/licenses/by/4.0/";
const CONTACT = "data@anotherjudorating.com";

// What each file holds, for the table of files (the README has every column).
const HOLDS: Record<string, string> = {
  "rating_history.csv.gz": "every rating change since 2009: one row per athlete per contest",
  "athletes.csv.gz": "id, name, gender, birth year, country",
  "competitions.csv.gz": "id, name, level, city, country, dates",
};

const size = (bytes: number) =>
  bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`;

const LINK = "underline hover:text-ink";
const H2 = "font-serif text-[22px] leading-[28px] font-bold text-ink mt-8 mb-2";

// The open-data archive the backend writes to R2 every week (ajr-backend ajr/tables):
// the files with their sizes and checksums from the manifest, the columns, the
// license. Without the manifest (R2 off, not written yet) the same text, no table.
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
  const data = await archive();
  const updated = data?.files[0]?.updated_at.slice(0, 10);
  return (
    <div className="w-full max-w-[760px] bg-paper pt-[37.25px] sm:pt-[47.25px] md:pt-[48.75px] pb-8 text-[15px] leading-relaxed text-ink">
      {data && <DatasetData data={data} updated={updated} />}
      <h1 className="font-serif text-[30px] leading-[36px] sm:text-[36px] sm:leading-[40px] font-bold tracking-[-0.015em]">
        Data
      </h1>
      <p className="mt-3">
        Everything the tables are built from, as files you can download and reproduce. One row per athlete
        per contest: who fought whom, on which day and at which weight, the chance of each side before the
        contest, and the rating, its deviation and volatility before and after. Plus the athletes and the
        competitions to join on.
      </p>
      <p className="mt-3">
        The files are rebuilt every week and carry the version of the rating settings they were computed
        with, so a number you quote today can be checked against the file it came from. After a change of
        the formula, the previous version stays available for 90 days.
      </p>

      <h2 className={H2}>Files</h2>
      {data ? (
        <>
          <p className="text-[14px] text-muted mb-3">
            Version <code className="text-ink">{data.version}</code>
            {updated && <>, updated {formatDate(updated)}</>}. SHA-256 checksums are in the{" "}
            {data.readme ? (
              <a href={data.readme} className={LINK}>
                README
              </a>
            ) : (
              "README"
            )}
            .
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-collapse">
              <thead>
                <tr className="border-b border-rule text-left text-muted">
                  <th className="py-2 pr-4 font-normal">File</th>
                  <th className="py-2 pr-4 font-normal text-right">Rows</th>
                  <th className="py-2 pr-4 font-normal text-right">Size</th>
                  <th className="py-2 font-normal">What it holds</th>
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
                    <td className="py-2 pr-4 text-right tabular-nums">{file.rows.toLocaleString("en-US")}</td>
                    <td className="py-2 pr-4 text-right tabular-nums whitespace-nowrap">{size(file.bytes)}</td>
                    <td className="py-2 text-muted">{HOLDS[file.name] ?? ""}</td>
                  </tr>
                ))}
                {data.readme && (
                  <tr className="border-b border-rule align-top">
                    <td className="py-2 pr-4">
                      <a href={data.readme} className={LINK}>
                        README.md
                      </a>
                    </td>
                    <td />
                    <td />
                    <td className="py-2 text-muted">every column, the rating settings, how to cite</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-muted">The archive is being prepared: come back in a few days.</p>
      )}

      <h2 className={H2}>Reading the files</h2>
      <p>
        The rating is Glicko-2: <code>rating</code> and <code>rd</code> (the rating deviation, how unsure the
        rating is) before and after each contest; the tables order athletes by score, the rating minus{" "}
        {String(data?.settings.rd_factor ?? 3)} × RD. <code>win_probability</code> is the athlete&apos;s chance
        before the contest. Join <code>athlete_id</code> and <code>opponent_id</code> on athletes.csv.gz and{" "}
        <code>competition_id</code> on competitions.csv.gz.
      </p>
      {data && (
        <pre className="mt-3 p-3 bg-panel border border-rule text-[13px] overflow-x-auto">
          {`import pandas as pd\nh = pd.read_csv("${data.files.find((f) => f.name === "rating_history.csv.gz")?.url ?? ""}")`}
        </pre>
      )}
      <p className="mt-3 text-[14px] text-muted">
        The &ldquo;Export CSV&rdquo; buttons on the site&apos;s tables save what the page shows, for a
        spreadsheet; this archive is the full, stable, citable dataset.
      </p>

      <h2 className={H2}>License and source</h2>
      <p>
        The ratings, win chances and these compiled files are published by Another Judo Rating under{" "}
        <a href={LICENSE} className={LINK}>
          CC BY 4.0
        </a>
        : use them for anything, including commercially, and credit &ldquo;Another Judo Rating
        (anotherjudorating.com)&rdquo;.
      </p>
      <p className="mt-3">
        Contest results come from the{" "}
        <a href="https://judobase.ijf.org/#/dashboard" target="_blank" rel="noopener" className={LINK}>
          IJF judobase
        </a>
        . The IJF retains all rights in its own data; this archive republishes only the identifiers, days,
        weights and outcomes needed to reproduce the rating. Another Judo Rating is independent and not
        affiliated with or endorsed by the International Judo Federation.
      </p>
      <p className="mt-3">
        To cite: <i>Another Judo Rating, rating history, version {data?.version ?? "<version>"}, {SITE}/data</i>.
      </p>
      <p className="mt-3">
        Questions, corrections or a removal request:{" "}
        <a href={`mailto:${CONTACT}`} className={LINK}>
          {CONTACT}
        </a>
        .
      </p>
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
