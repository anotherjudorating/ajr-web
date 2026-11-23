// Head-to-head: the form, the comparison, the chart.

import type { en } from "@/i18n/en";

export const h2h = {
  meta: {
    title: "Face-à-face en judo : comparer deux judokas",
    description: "Comparez deux judokas : leurs cotes au fil du temps, la chance de chacun de gagner aujourd’hui et tous leurs combats.",
    pairTitle: "{a} vs {b}",
    pairDescription: "Face-à-face : leurs cotes, la chance de chacun de gagner aujourd’hui et tous leurs combats.",
  },
  title: "Face-à-face",
  lead: "Comparez deux athlètes : cotes, chance de victoire et toutes leurs rencontres.",
  form: {
    weightCategory: "Catégorie de poids",
    chooseWeight: "Choisir la catégorie",
    athlete: "Athlète {n}", // Athlète 1, Athlète 2
    clear: "Effacer",
    searchAthlete: "Rechercher un athlète",
    noAthletes: "Aucun athlète trouvé",
  },
  popular: {
    title: "Duels populaires",
    athletes: "Athlètes",
    score: "Score",
    lastMeeting: "Dernière rencontre",
  },
  comparison: {
    currentChances: "Chances actuelles",
    howRatingsWork: "Comment fonctionne la cote",
    athlete: "Athlète",
    rank: "Rang",
    rating: "Cote",
    skill: "Force",
    rd: "RD",
    days90: "90 jours",
    winsLosses12m: "V–D 12 mois",
    chance: "Chance",
    note: "Chance d’après les cotes. Cote = force − RD.",
    notMet: "Ils ne se sont pas encore rencontrés en compétition IJF.",
    // the meetings' heading
    noMeetings: "Aucune rencontre pour l’instant",
    level: "Égalité {a}–{b}",
    leads: "{name} mène {high}–{low}",
    // the meetings table's heads, for screen readers
    date: "Date",
    tournament: "Tournoi",
    round: "Tour",
    winner: "Vainqueur",
    winnersChance: "Chance du vainqueur",
    upset: "Surprise",
    theContest: "Le combat",
  },
  chart: {
    rating: "Cote",
    // the chart's aria-label
    label: "Cote de {a} et {b}, du {from} au {to}",
  },
} satisfies typeof en.h2h;
