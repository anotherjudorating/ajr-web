import { CONTACT, type DataProse, JUDOBASE, LICENSE, LINK } from "./types";

export const en: DataProse = {
  meta: {
    title: "Judo rating data, CSV download",
    description:
      "Download the full rating history of every World Tour judoka as CSV: every contest since 2009 with win chances and ratings before and after. CC BY 4.0.",
  },
  title: "Export data",
  intro: (
    <>
      Everything the tables are built from, as files you can download and reproduce. One row per athlete per contest: who fought whom, on which day
      and at which weight, the chance of each side before the contest, and the rating, its deviation and volatility before and after. Plus the
      athletes and the competitions to join on.
    </>
  ),
  rebuilt: <>The files are rebuilt every week.</>,
  files: "Files",
  updated: "Updated {date}.",
  file: "File",
  rows: "Rows",
  size: "Size",
  preparing: "The archive is being prepared: come back in a few days.",
  licenseTitle: "License and source",
  license: (
    <>
      The ratings, win chances and these compiled files are published by Another Judo Rating under{" "}
      <a href={LICENSE} className={LINK}>
        CC BY 4.0
      </a>
      : use them for anything, including commercially, and credit &ldquo;Another Judo Rating (anotherjudorating.com)&rdquo;.
    </>
  ),
  source: (
    <>
      Contest results come from the{" "}
      <a href={JUDOBASE} target="_blank" rel="noopener" className={LINK}>
        IJF judobase
      </a>
      . The IJF retains all rights in its own data; this archive republishes only the identifiers, days, weights and outcomes needed to reproduce the
      rating. Another Judo Rating is independent and not affiliated with or endorsed by the International Judo Federation.
    </>
  ),
  cite: (site) => (
    <>
      To cite: <i>Another Judo Rating, rating history, {site}/data</i>.
    </>
  ),
  questions: (
    <>
      Questions, corrections or a removal request:{" "}
      <a href={`mailto:${CONTACT}`} className={LINK}>
        {CONTACT}
      </a>
      .
    </>
  ),
};
