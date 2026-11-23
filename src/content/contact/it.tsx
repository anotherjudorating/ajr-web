import { type ContactProse, DATA, EMAIL, ISSUES, LINK } from "./types";

export const it: ContactProse = {
  meta: {
    title: "Contatti",
    description: "Come contattare Another Judo Rating: domande, correzioni e idee per email, errori e risultati sbagliati su GitHub.",
  },
  title: "Contatti",
  questions: (
    <>
      Domande, correzioni e idee:{" "}
      <a href={`mailto:${EMAIL}`} className={LINK}>
        {EMAIL}
      </a>
      .
    </>
  ),
  issues: (
    <>
      Un risultato sbagliato, un incontro mancante, due atleti uniti in uno, o un errore del sito:{" "}
      <a href={ISSUES} target="_blank" rel="noopener" className={LINK}>
        apri una segnalazione su GitHub
      </a>
      , con il link alla pagina.
    </>
  ),
  dataset: (
    <>
      Il dataset, la sua licenza e le richieste di rimozione:{" "}
      <a href={`mailto:${DATA}`} className={LINK}>
        {DATA}
      </a>
      .
    </>
  ),
};
