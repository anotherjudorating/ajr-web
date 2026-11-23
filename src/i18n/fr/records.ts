// The records: the overview, each record page, the columns. The records themselves
// (slugs, backend names, kinds, views) are in lib/records.ts; their text is here, by
// the record's slug. `breakAfter`: where a title breaks on a phone, in French.

import type { en } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";

const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "Records historiques du judo",
    description: "Les records du judo depuis 2009 : meilleures cotes, plus longs règnes au n°1, plus de médailles, plus grosses surprises et d’autres.",
  },
  // "Meilleure cote, record du judo": a record page's title tag
  pageTitle: "{title}, record du judo",
  title: "Records",
  // {judobase} is the link to the IJF database, with the text below.
  lead: "Les meilleures performances de tous les temps, d’après les seuls combats disponibles dans la {judobase}, depuis 2009.",
  judobase: "base judobase de l’IJF",
  howRatingsWork: "Comment fonctionne la cote",
  // The tabs of /records.
  groups: {
    ratings: "Cotes",
    medals: "Médailles",
    contests: "Combats",
    rivalries: "Rivalités",
    tournaments: "Tournois",
    nations: "Nations",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Records", // before the group tabs
    groupsLabel: "Groupes de records", // the tabs' aria-label
    athletes: "Athlètes", // before the Men/Women filter
    all: "Tous",
    fullList: "Liste complète",
  },
  viewSwitch: {
    label: "Vue",
  },
  // A record's full list (components/records/RecordBrowser.tsx).
  browser: {
    // The search box, by what one row is about.
    search: {
      athlete: "Rechercher un athlète",
      tournament: "Rechercher un tournoi",
      nation: "Rechercher une nation",
    },
    menAndWomen: "Hommes et femmes",
    allWeights: "Toutes catégories",
    sortValueDesc: "Tri : {label} ↓",
    sortValueAsc: "Tri : {label} ↑",
    sortDateDesc: "Tri : date ↓",
    sortDateAsc: "Tri : date ↑",
    exportCsv: "Exporter en CSV",
    empty: "Aucun résultat pour ces filtres.",
  },
  // The headers of the records' tables (components/records/columns.tsx).
  columns: {
    athlete: "Athlète",
    nat: "Nat",
    weight: "Cat.",
    // "Hommes −73": a row's weight without the unit
    weightName: "{gender} {label}",
    peak: "Pic",
    date: "Date",
    weeks: "Semaines",
    until: "Jusqu’au",
    lead: "Avance",
    age: "Âge",
    total: "Total",
    inARow: "D’affilée",
    period: "Période",
    tournament: "Tournoi",
    wins: "Victoires",
    avgChance: "Chance moy.",
    overNo1: "Sur le n°1",
    upsetWins: "Surprises",
    winnerLoser: "Vainqueur / vaincu",
    chance: "Chance",
    avgRating: "Cote moy.",
    avg: "Moy.", // the same header on phones
    avgRatingTip: "Cote moyenne des engagés",
    nations: "Nations",
    nationsTip: "Nations avec au moins une médaille",
    upsets: "Surprises",
    upsetsTip: "Combats perdus par le favori de la cote",
    favWon: "Fav. gagne",
    favWonTip: "Combats gagnés par le favori de la cote",
    rating: "Cote",
    golds: "Ors",
    medals: "Médailles",
    years: "Années",
    finals: "Finales",
    won: "Gagnées",
    wonShare: "% gagnées",
    contests: "Combats",
    time: "Temps",
    athletes: "Athlètes",
    meetings: "Rencontres",
    score: "Score",
    nemesisOpponent: "Bête noire / adversaire",
    weights: "Catégories",
    inTop10: "Dans le top 10",
    nation: "Nation",
  },
  // Each record's text, by its slug (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Meilleure cote",
      description: "La plus haute cote atteinte par chaque athlète depuis 2011, une ligne par athlète.",
      noun: "athletes",
      sortLabel: "pic",
    }),
    "longest-at-1": record({
      title: "Le plus longtemps n°1",
      description: "Semaines au n°1 du classement d’une catégorie depuis 2011, au total. La catégorie est celle qui compte le plus de semaines.",
      noun: "athletes",
      sortLabel: "semaines",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "D’affilée", description: "La plus longue série ininterrompue au n°1 du classement d’une catégorie depuis 2011." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Le plus de semaines dans le top 8",
      breakAfter: "Le plus de semaines",
      description:
        "Semaines dans le top 8 du classement d’une catégorie (les têtes de série d’un championnat du monde ou des Jeux) depuis 2011, au total. Une semaine compte une fois, même si l’athlète figurait dans deux catégories.",
      noun: "athletes",
      sortLabel: "semaines",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "D’affilée", description: "La plus longue série ininterrompue dans le top 8 du classement d’une catégorie depuis 2011." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Le plus longtemps n°1 P4P",
      breakAfter: "Le plus longtemps",
      description: "Semaines au n°1 du classement toutes catégories, hommes et femmes à part, depuis 2011, au total.",
      noun: "athletes",
      sortLabel: "semaines",
      views: {
        total: { label: "Total" },
        "in-a-row": {
          label: "D’affilée",
          description: "La plus longue série ininterrompue au n°1 du classement toutes catégories, hommes et femmes à part, depuis 2011.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Plus grande avance P4P",
      description: "La plus grande avance d’un n°1 toutes catégories sur les 7 meilleurs autres de sa catégorie, depuis 2011.",
      noun: "athletes",
      sortLabel: "avance",
    }),
    "youngest-1": record({
      title: "Plus jeune n°1",
      description: "Les plus jeunes athlètes à atteindre le n°1 du classement d’une catégorie depuis 2011. Âge d’après l’année de naissance.",
      noun: "athletes",
      sortLabel: "âge",
    }),
    "most-world-tour-medals": record({
      title: "Le plus de médailles du World Tour",
      breakAfter: "Le plus de médailles",
      description: "Médailles aux épreuves du World Tour de l’IJF et aux Jeux olympiques, une ligne par athlète.",
      noun: "athletes",
      sortLabel: "médailles",
      views: {
        total: { label: "Total" },
        gold: { label: "Or", description: "Médailles d’or aux épreuves du World Tour de l’IJF et aux Jeux olympiques, une ligne par athlète." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Le plus de médailles d’affilée",
      breakAfter: "Le plus de médailles",
      description: "Épreuves du World Tour de l’IJF et Jeux olympiques terminés d’affilée avec une médaille.",
      noun: "athletes",
      sortLabel: "d’affilée",
      views: {
        total: { label: "Total" },
        gold: { label: "Or", description: "Épreuves du World Tour de l’IJF et Jeux olympiques gagnés d’affilée." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Plus jeune médaillé en Grand Slam",
      breakAfter: "Plus jeune médaillé",
      description: "Les plus jeunes athlètes médaillés dans un Grand Slam. Âge d’après l’année de naissance.",
      noun: "athletes",
      sortLabel: "âge",
      views: {
        any: { label: "Toute médaille" },
        gold: { label: "Or", description: "Les plus jeunes vainqueurs d’un Grand Slam. Âge d’après l’année de naissance." },
      },
    }),
    "longest-medal-span": record({
      title: "Plus longue carrière médaillée",
      breakAfter: "Plus longue",
      description: "Le plus d’années entre la première et la dernière médaille d’un athlète aux épreuves du World Tour de l’IJF et aux Jeux olympiques.",
      noun: "athletes",
      sortLabel: "années",
    }),
    "best-finals-record": record({
      title: "Meilleur bilan en finale",
      description: "La part de finales gagnées aux épreuves du World Tour de l’IJF et aux Jeux olympiques, pour les athlètes ayant au moins 10 finales.",
      noun: "athletes",
      sortLabel: "gagnées",
    }),
    "least-likely-champion": record({
      title: "Champion le plus improbable",
      breakAfter: "Champion",
      description: "Les vainqueurs du World Tour auxquels la cote donnait la plus petite chance de gagner tous les combats de leur tableau, depuis 2011.",
      noun: "titles",
      sortLabel: "chance",
    }),
    "longest-winning-streak": record({
      title: "Plus longue série de victoires",
      breakAfter: "Plus longue série",
      description: "Combats gagnés d’affilée.",
      noun: "athletes",
      sortLabel: "victoires",
    }),
    "biggest-upsets": record({
      title: "Plus grosses surprises",
      description: "Victoires sur un athlète du top 10 de la catégorie auxquelles la cote donnait la plus petite chance avant le combat, depuis 2011.",
      noun: "contests",
      sortLabel: "chance",
    }),
    "giant-killer": record({
      title: "Tueur de géants",
      description: "Victoires en outsider sur des athlètes alors dans le top 10 de la catégorie, depuis 2011.",
      noun: "athletes",
      sortLabel: "surprises",
    }),
    "golden-score-king": record({
      title: "Roi du golden score",
      description: "Combats gagnés au golden score, depuis 2017.",
      noun: "athletes",
      sortLabel: "victoires au golden score",
    }),
    "longest-contest": record({
      title: "Combat le plus long",
      description: "Les plus longs combats du World Tour, golden score compris.",
      noun: "contests",
      sortLabel: "temps",
    }),
    "greatest-rivalry": record({
      title: "Plus grande rivalité",
      description:
        "Les paires qui se sont le plus souvent rencontrées au sommet, et le plus équitablement. Chaque rencontre compte selon la cote du moins fort des deux avant le combat, de 0 à 1900 jusqu’à 1 à 2500. La somme est réduite quand le face-à-face est à sens unique : Σ min(1, max(0, (cote − 1900) / 600)) × (1 − ((victoires − défaites) / rencontres)²).",
      noun: "rivalries",
      sortLabel: "score",
    }),
    "longest-rivalry": record({
      title: "Plus longue rivalité",
      description:
        "Le plus d’années entre la première et la dernière rencontre d’une paire. Une paire qui ne s’est rencontrée que quelques fois compte moins : années × (rencontres − 1) / (rencontres + 1).",
      noun: "rivalries",
      sortLabel: "score",
    }),
    nemesis: record({
      title: "Bête noire",
      description:
        "Les athlètes qui ont battu encore et encore un adversaire plus fort. Seules comptent les rencontres où la cote les donnait outsiders : chacune ajoute la victoire au-delà de la chance accordée, davantage quand l’adversaire était fort : Σ (gagné − chance) × min(1, max(0, (cote de l’adversaire − 1900) / 600)).",
      noun: "pairs",
      sortLabel: "score",
    }),
    "strongest-tournament": record({
      title: "Tournoi le plus relevé",
      description: "La cote moyenne, avant le tournoi, des 8 meilleurs engagés de chaque catégorie, depuis 2011.",
      noun: "tournaments",
      sortLabel: "cote moy.",
    }),
    "most-nations-on-the-podium": record({
      title: "Le plus de nations sur le podium",
      breakAfter: "Le plus de nations",
      description: "Les tournois dont les médailles sont allées au plus grand nombre de nations.",
      noun: "tournaments",
      sortLabel: "nations",
    }),
    "most-unpredictable-tournament": record({
      title: "Tournoi le plus imprévisible",
      breakAfter: "Tournoi",
      description: "Les tournois dont la cote a le moins bien prédit les combats (le log loss le plus haut), depuis 2011.",
      noun: "tournaments",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Meilleure cote d’équipe",
      description: "La plus haute cote d’équipe atteinte par chaque nation depuis 2011.",
      noun: "nations",
      sortLabel: "cote",
    }),
    "most-medals": record({
      title: "Le plus de médailles",
      description: "Médailles aux épreuves du World Tour de l’IJF et aux Jeux olympiques, par nation.",
      noun: "nations",
      sortLabel: "médailles",
    }),
    "deepest-team": record({
      title: "Équipe la plus dense",
      description: "Le plus d’athlètes d’une même nation dans le top 10 de leur catégorie le même jour, depuis 2011.",
      noun: "nations",
      sortLabel: "athlètes",
    }),
  },
} satisfies typeof en.records;
