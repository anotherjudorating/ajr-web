// The records: the overview, each record page, the columns. The records themselves
// (slugs, backend names, kinds, views) are in lib/records.ts; their text is here, by
// the record's slug, and components/records/text.ts joins the two.

import type { en } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";

// Marks a record's text, so that every entry has the one type (a translation may
// break a title where English does not).
const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "Record di sempre del judo",
    description: "I record di sempre del judo: rating più alti, regni più lunghi al n. 1, più medaglie, sorprese più grandi e altro.",
  },
  // "Rating più alto, record del judo": a record page's title tag
  pageTitle: "{title}, record del judo",
  title: "Record",
  // {judobase} is the link to the IJF database, with the text below.
  lead: "I primati di sempre, basati solo sugli incontri disponibili in {judobase}, dal 2009.",
  judobase: "IJF judobase",
  howRatingsWork: "Come funziona il rating",
  // The tabs of /records.
  groups: {
    ratings: "Rating",
    medals: "Medaglie",
    contests: "Incontri",
    rivalries: "Rivalità",
    tournaments: "Tornei",
    nations: "Nazioni",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Record", // before the group tabs
    groupsLabel: "Gruppi di record", // the tabs' aria-label
    athletes: "Atleti", // before the Men/Women filter
    all: "Tutti",
    fullList: "Elenco completo",
  },
  viewSwitch: {
    label: "Vista",
  },
  // A record's full list (components/records/RecordBrowser.tsx).
  browser: {
    // The search box, by what one row is about.
    search: {
      athlete: "Cerca atleta",
      tournament: "Cerca torneo",
      nation: "Cerca nazione",
    },
    menAndWomen: "Uomini e donne",
    allWeights: "Tutte le categorie",
    sortValueDesc: "Ordina: {label} ↓",
    sortValueAsc: "Ordina: {label} ↑",
    sortDateDesc: "Ordina: data ↓",
    sortDateAsc: "Ordina: data ↑",
    exportCsv: "Esporta CSV",
    empty: "Nessun risultato con questi filtri ({noun}).",
  },
  // The headers of the records' tables (components/records/columns.tsx).
  columns: {
    athlete: "Atleta",
    nat: "Naz",
    weight: "Categoria",
    // "Uomini −73": a row's weight without the unit
    weightName: "{gender} {label}",
    peak: "Picco",
    date: "Data",
    weeks: "Settimane",
    until: "Fino a",
    lead: "Margine",
    age: "Età",
    total: "Totale",
    inARow: "Di fila",
    period: "Periodo",
    tournament: "Torneo",
    wins: "Vittorie",
    avgChance: "Prob. media",
    overNo1: "Sul n. 1",
    upsetWins: "Sorprese",
    winnerLoser: "Vincitore / sconfitto",
    chance: "Prob.",
    avgRating: "Rating medio",
    avg: "Media", // the same header on phones
    avgRatingTip: "Rating medio dei partecipanti",
    nations: "Nazioni",
    nationsTip: "Nazioni con almeno una medaglia",
    upsets: "Sorprese",
    upsetsTip: "Incontri persi dal favorito del rating",
    favWon: "Fav. vince",
    favWonTip: "Incontri vinti dal favorito del rating",
    rating: "Rating",
    golds: "Ori",
    medals: "Medaglie",
    years: "Anni",
    finals: "Finali",
    won: "Vinte",
    wonShare: "Vinte %",
    contests: "Incontri",
    time: "Tempo",
    athletes: "Atleti",
    meetings: "Incontri",
    score: "Punteggio",
    nemesisOpponent: "Bestia nera / avversario",
    weights: "Categorie",
    inTop10: "In top 10",
    nation: "Nazione",
  },
  // Each record's text, by its slug (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Rating più alto",
      description: "Il rating più alto raggiunto da ogni atleta dal 2011, una riga per atleta.",
      noun: "atleti",
      sortLabel: "picco",
    }),
    "longest-at-1": record({
      title: "Più a lungo al n. 1",
      description: "Settimane al n. 1 del ranking di una categoria dal 2011, in totale. La categoria è quella con più settimane.",
      noun: "atleti",
      sortLabel: "settimane",
      views: {
        total: { label: "Totale" },
        "in-a-row": { label: "Di fila", description: "La serie ininterrotta più lunga al n. 1 del ranking di una categoria dal 2011." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Più settimane nella top 8",
      breakAfter: "Più settimane",
      description:
        "Settimane nella top 8 del ranking di una categoria (le teste di serie di un Mondiale o di un’Olimpiade) dal 2011, in totale. Una settimana conta una volta anche se l’atleta era in due categorie.",
      noun: "atleti",
      sortLabel: "settimane",
      views: {
        total: { label: "Totale" },
        "in-a-row": { label: "Di fila", description: "La serie ininterrotta più lunga nella top 8 del ranking di una categoria dal 2011." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Più a lungo al n. 1 P4P",
      breakAfter: "Più a lungo",
      description: "Settimane al n. 1 del ranking pound for pound, uomini e donne separati, dal 2011, in totale.",
      noun: "atleti",
      sortLabel: "settimane",
      views: {
        total: { label: "Totale" },
        "in-a-row": {
          label: "Di fila",
          description: "La serie ininterrotta più lunga al n. 1 del ranking pound for pound, uomini e donne separati, dal 2011.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Margine P4P più grande",
      description: "Il margine più grande di un n. 1 pound for pound sui 7 migliori altri atleti della sua categoria, dal 2011.",
      noun: "atleti",
      sortLabel: "margine",
    }),
    "youngest-1": record({
      title: "N. 1 più giovane",
      description: "Gli atleti più giovani ad arrivare al n. 1 del ranking di una categoria dal 2011. Età per anno di nascita.",
      noun: "atleti",
      sortLabel: "età",
    }),
    "most-world-tour-medals": record({
      title: "Più medaglie nel World Tour",
      breakAfter: "Più medaglie",
      description: "Medaglie nelle gare del World Tour IJF e ai Giochi Olimpici, una riga per atleta.",
      noun: "atleti",
      sortLabel: "medaglie",
      views: {
        total: { label: "Totale" },
        gold: { label: "Oro", description: "Medaglie d’oro nelle gare del World Tour IJF e ai Giochi Olimpici, una riga per atleta." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Più medaglie di fila",
      description: "Gare del World Tour IJF e Giochi Olimpici di fila chiusi con una medaglia.",
      noun: "atleti",
      sortLabel: "di fila",
      views: {
        total: { label: "Totale" },
        gold: { label: "Oro", description: "Gare del World Tour IJF e Giochi Olimpici vinti di fila." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Medaglia Grand Slam più giovane",
      breakAfter: "Medaglia Grand Slam",
      description: "Gli atleti più giovani a vincere una medaglia in un Grand Slam. Età per anno di nascita.",
      noun: "atleti",
      sortLabel: "età",
      views: {
        any: { label: "Qualsiasi medaglia" },
        gold: { label: "Oro", description: "I più giovani vincitori di un Grand Slam. Età per anno di nascita." },
      },
    }),
    "longest-medal-span": record({
      title: "Medaglie più distanti nel tempo",
      breakAfter: "Medaglie più distanti",
      description: "Il maggior numero di anni tra la prima e l’ultima medaglia di un atleta nelle gare del World Tour IJF e ai Giochi Olimpici.",
      noun: "atleti",
      sortLabel: "anni",
    }),
    "best-finals-record": record({
      title: "Miglior rendimento in finale",
      breakAfter: "Miglior rendimento",
      description: "La quota di finali vinte nelle gare del World Tour IJF e ai Giochi Olimpici, per gli atleti con almeno 10 finali.",
      noun: "atleti",
      sortLabel: "vinte",
    }),
    "least-likely-champion": record({
      title: "Campione meno probabile",
      breakAfter: "Campione",
      description: "I campioni del World Tour a cui il rating dava la probabilità più bassa di vincere tutti gli incontri del loro tabellone, dal 2011.",
      noun: "titoli",
      sortLabel: "probabilità",
    }),
    "longest-winning-streak": record({
      title: "Serie di vittorie più lunga",
      breakAfter: "Serie di vittorie",
      description: "Incontri vinti di fila.",
      noun: "atleti",
      sortLabel: "vittorie",
    }),
    "biggest-upsets": record({
      title: "Sorprese più grandi",
      description: "Vittorie su un atleta della top 10 della categoria a cui il rating dava la probabilità più bassa prima dell’incontro, dal 2011.",
      noun: "incontri",
      sortLabel: "probabilità",
    }),
    "giant-killer": record({
      title: "Ammazzagrandi",
      description: "Vittorie da sfavorito su atleti allora nella top 10 della categoria, dal 2011.",
      noun: "atleti",
      sortLabel: "sorprese",
    }),
    "golden-score-king": record({
      title: "Re del golden score",
      description: "Incontri vinti al golden score, dal 2017.",
      noun: "atleti",
      sortLabel: "vittorie al golden score",
    }),
    "longest-contest": record({
      title: "Incontro più lungo",
      description: "Gli incontri più lunghi del World Tour, golden score compreso.",
      noun: "incontri",
      sortLabel: "tempo",
    }),
    "greatest-rivalry": record({
      title: "Rivalità più grande",
      description:
        "Le coppie che si sono affrontate più spesso ai vertici e in modo più equilibrato. Ogni incontro vale in base al rating del più debole prima di esso, da 0 a 1900 a 1 a 2500. La somma si riduce se il testa a testa è a senso unico: Σ min(1, max(0, (rating − 1900) / 600)) × (1 − ((vittorie − sconfitte) / incontri)²).",
      noun: "rivalità",
      sortLabel: "punteggio",
    }),
    "longest-rivalry": record({
      title: "Rivalità più lunga",
      description:
        "Il maggior numero di anni tra il primo e l’ultimo incontro di una coppia. Una coppia che si è affrontata poche volte conta meno: anni × (incontri − 1) / (incontri + 1).",
      noun: "rivalità",
      sortLabel: "punteggio",
    }),
    nemesis: record({
      title: "Bestia nera",
      description:
        "Atleti che hanno continuato a battere un avversario più forte. Contano solo gli incontri in cui il rating li dava sfavoriti: ciascuno aggiunge la vittoria oltre la probabilità concessa, di più quanto più forte era l’avversario: Σ (vinto − probabilità) × min(1, max(0, (rating dell’avversario − 1900) / 600)).",
      noun: "coppie",
      sortLabel: "punteggio",
    }),
    "strongest-tournament": record({
      title: "Torneo più forte",
      description: "Il rating medio, prima del torneo, degli 8 migliori iscritti di ogni categoria, dal 2011.",
      noun: "tornei",
      sortLabel: "rating medio",
    }),
    "most-nations-on-the-podium": record({
      title: "Più nazioni sul podio",
      description: "I tornei le cui medaglie sono andate a più nazioni.",
      noun: "tornei",
      sortLabel: "nazioni",
    }),
    "most-unpredictable-tournament": record({
      title: "Torneo più imprevedibile",
      breakAfter: "Torneo",
      description: "I tornei i cui incontri il rating ha previsto peggio (il log loss più alto), dal 2011.",
      noun: "tornei",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Rating di squadra più alto",
      breakAfter: "Rating di squadra",
      description: "Il rating di squadra più alto raggiunto da ogni nazione dal 2011.",
      noun: "nazioni",
      sortLabel: "rating",
    }),
    "most-medals": record({
      title: "Più medaglie",
      description: "Medaglie nelle gare del World Tour IJF e ai Giochi Olimpici, per nazione.",
      noun: "nazioni",
      sortLabel: "medaglie",
    }),
    "deepest-team": record({
      title: "Squadra più profonda",
      description: "Il maggior numero di atleti di una nazione nella top 10 delle loro categorie in un solo giorno, dal 2011.",
      noun: "nazioni",
      sortLabel: "atleti",
    }),
  },
} satisfies typeof en.records;
