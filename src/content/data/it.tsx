import { CONTACT, type DataProse, JUDOBASE, LICENSE, LINK } from "./types";

export const it: DataProse = {
  meta: {
    title: "Dati del rating di judo, scarica il CSV",
    description:
      "Scarica la storia completa del rating di ogni judoka del World Tour in CSV: tutti gli incontri dal 2009 con le probabilità di vittoria e i rating prima e dopo. CC BY 4.0.",
  },
  title: "Esporta i dati",
  intro: (
    <>
      Tutto ciò da cui sono costruite le classifiche, in file da scaricare e ricalcolare. Una riga per atleta per incontro: chi ha combattuto con
      chi, in quale giorno e in quale categoria, la probabilità di ciascun lato prima dell’incontro, e il rating, la sua deviazione e la sua
      volatilità prima e dopo. In più gli atleti e le competizioni per collegare il tutto.
    </>
  ),
  rebuilt: <>I file vengono ricostruiti ogni settimana.</>,
  files: "File",
  updated: "Aggiornato il {date}.",
  file: "File",
  rows: "Righe",
  size: "Dimensione",
  preparing: "L’archivio è in preparazione: torna tra qualche giorno.",
  licenseTitle: "Licenza e fonte",
  license: (
    <>
      I rating, le probabilità di vittoria e questi file compilati sono pubblicati da Another Judo Rating con licenza{" "}
      <a href={LICENSE} className={LINK}>
        CC BY 4.0
      </a>
      : si possono usare per qualsiasi scopo, anche commerciale, citando «Another Judo Rating (anotherjudorating.com)».
    </>
  ),
  source: (
    <>
      I risultati degli incontri vengono da{" "}
      <a href={JUDOBASE} target="_blank" rel="noopener" className={LINK}>
        IJF judobase
      </a>
      . L’IJF conserva tutti i diritti sui propri dati. Questo archivio ripubblica solo gli identificativi, i giorni, le categorie e gli esiti
      necessari a riprodurre il rating. Another Judo Rating è indipendente e non è affiliato né approvato dalla Federazione Internazionale
      Judo.
    </>
  ),
  cite: (site) => (
    <>
      Per citare: <i>Another Judo Rating, rating history, {site}/data</i>.
    </>
  ),
  questions: (
    <>
      Domande, correzioni o una richiesta di rimozione:{" "}
      <a href={`mailto:${CONTACT}`} className={LINK}>
        {CONTACT}
      </a>
      .
    </>
  ),
};
