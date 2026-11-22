import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const en: ContactProse = {
  meta: {
    title: "Contact",
    description: "How to reach Another Judo Rating: questions, corrections and ideas by email, bugs and wrong results on GitHub.",
  },
  title: "Contact",
  questions: (
    <>
      Questions, corrections and ideas:{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      A wrong result, a missing contest, two athletes merged into one, or a bug on the site:{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        open an issue on GitHub
      </a>
      , with a link to the page.
    </>
  ),
  dataset: (
    <>
      The dataset, its license and removal requests:{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
