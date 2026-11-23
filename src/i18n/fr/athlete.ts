// An athlete's page: the header, the charts, the contests, the lists.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const athlete = {
  // The title and the description for search engines (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name} : cote et résultats en judo",
    // "Hidayat Heydarov (Azerbaïdjan, né en 1997) : n°1 chez les hommes −73 kg avec une cote de 2543, pic à 2600 en juil 2024."
    summary: "{name} ({who}) : {standing}{peak}.",
    summaryNoWho: "{name} : {standing}{peak}.", // no nation and no year of birth
    born: "né en {year}",
    judo: "judo", // the weight is not known: "coté en judo"
    ranked: "n°{place} en {where} avec une cote de {score}",
    unranked: "coté en {where}, hors classement (aucun combat depuis un an)",
    peak: ", pic à {score} en {month}", // after the standing; empty without a peak
  },
  // "−73 kg": a weight tab, a filter's option, the Rank chart's legend
  weightKg: "{weight} kg",
  header: {
    age: forms({ other: "{n} ans" }),
    rank: "Rang",
    best: "Meilleur",
    peak: "Pic",
    inactive: "Inactif",
    inactiveTitle: "Aucun combat depuis plus d’un an : hors des classements jusqu’au prochain",
    tableOfWeek: "Le classement de cette semaine-là",
    ijfTitle: "Place dans le classement mondial IJF. ↑ mieux classé chez l’IJF que chez AJR, ↓ moins bien. Ouvre le profil IJF de l’athlète.",
    showOnChart: "Voir sur le graphique",
    // the weeks at #1: the heads of the small table and its rows
    weeks: "Semaines",
    total: "Total",
    longestRun: "Plus longue série",
    atOne: "N°1",
    p4pAtOne: "N°1 P4P",
    // the label of a run marked on the Rank chart
    weeksAtOne: forms({ one: "{n} semaine n°1", other: "{n} semaines n°1" }),
    weeksP4pAtOne: forms({ one: "{n} semaine n°1 toutes catégories", other: "{n} semaines n°1 toutes catégories" }),
    weeksTop8: forms({ one: "{n} semaine dans le top 8", other: "{n} semaines dans le top 8" }),
    firstAtOne: "Premier n°1, à {age}", // a record's week: the first week at #1, with the age
    currentRating: "Cote actuelle",
    lastRating: "Dernière cote, {month}", // an inactive athlete's
    change: "Variation",
    rating: "Cote",
    days90: "90 jours",
    months6: "6 mois",
    skill: "force",
    uncertainty: "incertitude",
    howItWorks: "Comment ça marche",
  },
  chart: {
    rating: "Cote",
    rank: "Rang",
    ratingOrRank: "Cote ou rang", // the switch's aria-label
    // the windows of every rating chart (the head-to-head's too)
    ranges: { "1Y": "1 an", "4Y": "4 ans", All: "Tout" },
    peakPeriod: "Pic, {date}", // the peak's point in the tip
    inactive: "Inactif",
    inactiveZone: "Aucun combat depuis plus d’un an : hors des classements jusqu’au prochain. La cote reste, son incertitude grandit, donc le score glisse vers le bas.",
    inactiveLegend: "Aucun combat depuis plus d’un an : hors des classements",
    skillLabel: "Force {n}",
    uncertaintyLabel: "−{n} incertitude",
    ratingLabel: "Cote {n}",
    peakLabel: "Pic {score}",
    peakBefore: "Pic en {month} : voir toute la carrière", // the peak is before the window
    showContests: "Voir les combats",
    takeMarkOff: "Retirer le repère",
    takeMarkOffEsc: "Retirer le repère (Échap)",
    // a marked run's label with its months: "12 semaines n°1, janv 2024 – mars 2024"
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Force",
    uncertainty: "Incertitude",
    top8: "Top 8",
    // the Rank chart's tip
    weekOf: "Semaine du {date}",
    placeIn: "N°{place} en {weight} kg",
    notInTable: "Hors du classement {weight} kg",
    p4pPlace: "P4P n°{place}",
    placeP4p: "N°{place} toutes catégories",
  },
  contests: {
    title: "Combats",
    search: "Rechercher un adversaire ou un tournoi",
    allYears: "Toutes les années",
    weight: "Catégorie",
    allWeights: "Toutes catégories",
    level: "Niveau du tournoi",
    allLevels: "Tous les niveaux",
    // the result filter, by its value ("" is every contest)
    results: { "": "Tous les combats", w: "Victoires", l: "Défaites", uw: "Victoires surprises", ul: "Défaites surprises" },
    sorts: {
      "date-desc": "Tri : date ↓",
      "date-asc": "Tri : date ↑",
      "chance-asc": "Tri : chance ↑",
      "chance-desc": "Tri : chance ↓",
      "gain-desc": "Tri : variation de cote ↓",
      "gain-asc": "Tri : variation de cote ↑",
    },
    exportCsv: "Exporter en CSV",
    round: "Tour",
    opponent: "Adversaire",
    date: "Date",
    opponentRating: "Adv.",
    chance: "Chance",
    result: "Résultat",
    upset: "Surprise",
    win: "V",
    loss: "D",
    theContest: "Le combat",
    noMatch: "Aucun combat ne correspond à ces filtres.",
    range: "{from}–{to} sur {total}", // "1–25 sur 112 combats"
    show: "Afficher",
  },
  lists: {
    bestWins: "Meilleures victoires",
    toughestLosses: "Défaites les plus dures",
    all: "Tout",
    opponentRating: "Cote de l’adversaire avant le combat",
    noneYet: "Rien pour l’instant.",
    frequentOpponents: "Adversaires fréquents",
    noRepeat: "Aucun adversaire rencontré deux fois pour l’instant.",
    liveAndUpcoming: "En direct et à venir",
    dates: "Dates",
    tournament: "Tournoi",
    gold: "Or",
    medal: "Médaille",
    live: "En direct",
  },
  results: {
    title: "Résultats",
    level: "Niveau",
    // the medal columns' tooltips
    medals: { gold: "or", silver: "argent", bronze: "bronze" },
    fifth: "Cinquième place",
    seventh: "Septième place",
    other: "Autre",
    otherTitle: "Éliminé plus tôt, ou un résultat que judobase ne donne pas",
    total: "Total",
    totalTitle: "Tournois disputés",
    // the levels too long for one line of a phone, by their id (lib/levels.ts)
    short: {
      worlds: "Ch. du monde",
      continental: "Ch. continentaux",
      opens: "Opens et coupes",
    },
  },
} satisfies typeof en.athlete;
