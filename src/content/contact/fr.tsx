import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const fr: ContactProse = {
  meta: {
    title: "Contact",
    description: "Comment joindre Another Judo Rating : questions, corrections et idées par e-mail, bugs et résultats erronés sur GitHub.",
  },
  title: "Contact",
  questions: (
    <>
      Questions, corrections et idées :{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      Un résultat erroné, un combat manquant, deux athlètes fusionnés en un seul, ou un bug sur le site :{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        ouvrez un ticket sur GitHub
      </a>
      , avec un lien vers la page.
    </>
  ),
  dataset: (
    <>
      Le jeu de données, sa licence et les demandes de retrait :{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
