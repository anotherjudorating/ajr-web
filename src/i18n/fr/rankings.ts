// The rankings: the weights, pound for pound, the nations, their tables and the panel.

import type { en } from "@/i18n/en";

export const rankings = {
  teams: "Équipes",
  // WeightSwitcher: the small labels before the rows (a language may abbreviate)
  switcher: { men: "Hommes", women: "Femmes", teams: "Équipes" },
  breadcrumb: "Classements",
  // "−73 kg": a weight in a list or a column
  weightKg: "{label} kg",
  // the <title> of a past day's table
  pastTitle: "{title} au {date}",
  loading: "Chargement…",
  // a weight's table (app/[lang]/rankings/[weight])
  weight: {
    title: "Classement mondial de judo {weight}",
    strongest: "Les judokas les plus forts en {weight}",
    strongestOn: "Les judokas les plus forts en {weight} au {date}",
    description: "{strongest} : {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // pound for pound (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "Classement de judo toutes catégories, {gender}",
    description: "Les meilleurs judokas {gender} toutes catégories confondues : de combien chacun domine le reste de sa catégorie.",
    breadcrumb: "{gender} toutes catégories",
  },
  // the nations (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Classement des nations de judo, {who}",
    who: { men: "hommes", women: "femmes", mixed: "hommes et femmes" },
    description: "Quel pays a l’équipe de judo la plus forte : chaque nation cotée d’après son meilleur athlète dans chaque catégorie.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "Nations {gender}",
  },
  // TableParts: the toolbar over a table and the pages under it
  toolbar: {
    searchAthlete: "Rechercher un athlète",
    searchNation: "Rechercher une nation",
    allCountries: "Tous les pays",
    asOf: "Classement à cette date",
    exportCsv: "Exporter en CSV",
  },
  pagination: {
    range: "{from}–{to} sur {count}", // "1–50 sur 625 athlètes"
    show: "Afficher",
  },
  sorts: {
    ratingDesc: "Tri : cote ↓",
    ratingAsc: "Tri : cote ↑",
    d90Desc: "Tri : +/− 90 jours ↓",
    d90Asc: "Tri : +/− 90 jours ↑",
    d6mDesc: "Tri : +/− 6 mois ↓",
    d6mAsc: "Tri : +/− 6 mois ↑",
    ledDesc: "Tri : top 1 ↓",
    top8Desc: "Tri : top 8 ↓",
    leadDesc: "Tri : avance ↓",
    leadAsc: "Tri : avance ↑",
  },
  // the tables' header cells
  columns: {
    athlete: "Athlète",
    nat: "NAT",
    country: "Pays",
    weight: "Cat.",
    rating: "Cote",
    age: "Âge",
    last: "Dernier",
    trend: "Tendance",
    d90: "90 j",
    m6: "6 m",
    change6m: "+/- 6 m",
    lead: "Avance",
    nation: "Nation",
    top1: "Top 1",
    top8: "Top 8",
    leadersAvg: "Moy. leaders",
    leadersRatingAvg: "Cote moyenne des leaders",
  },
  // what the header cells say on hover
  tips: {
    rank90: "Variation de rang sur 90 jours",
    rating90: "Variation de cote sur 90 jours",
    rank6m: "Variation de rang sur 182 jours",
    rating6m: "Variation de cote sur 182 jours",
    ijf: "Place dans le classement mondial IJF",
    ijfDifference: "Place IJF comparée à la place AJR : ↓ moins bien classé chez l’IJF, ↑ mieux",
    lead: "Points d’avance sur la moyenne des 7 suivants de sa catégorie",
    top1: "Catégories où la nation a le meilleur athlète de toutes les nations",
    top8: "Catégories où le meilleur athlète de la nation figure parmi les 8 meilleures nations",
    leadersAvg:
      "Cote moyenne du meilleur athlète de la nation dans chacune des {weights} catégories, une catégorie sans athlète compte comme la dernière place de ce classement",
  },
  // the rating cell's tip: how the shown rating is made
  score: {
    glicko: "Cote Glicko-2",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Voir les 90 derniers jours",
  noAthletes: "Aucun athlète ne correspond à ces filtres.",
  noNations: "Aucune nation ne correspond à ces filtres.",
  // Changes: an athlete not in the table back then
  changes: {
    new: "NOUV",
    returning: "RET",
  },
  // AthletePanel: the expanded row
  panel: {
    ijf: "Classement mondial IJF",
    last90: "90 derniers jours",
    failed: "Impossible de charger les combats.",
    none: "Aucun combat depuis 90 jours.",
    upset: "Surprise",
    won: "V",
    lost: "D",
    contest: "Le combat",
  },
  // Medal: the aria-label
  medal: {
    gold: "or",
    silver: "argent",
    bronze: "bronze",
    predicted: "{kind} prévu",
  },
  // chart.tsx: the names of a line's points and its tips
  chart: {
    today: "Aujourd’hui",
    weekOf: "Semaine du {date}",
    quarter: "T{n} {year}",
    inactive: "inactif",
    rank: "Rang",
    peak: "Pic {score}",
  },
} satisfies typeof en.rankings;
