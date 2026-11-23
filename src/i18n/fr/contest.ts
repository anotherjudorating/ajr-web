// A contest's page.

import type { en } from "@/i18n/en";

export const contest = {
  meta: {
    names: "{white} vs {blue}",
    title: "{names}, {round}, {competition}",
    noRound: "combat", // a contest whose stage is not known
  },
  tournaments: "Tournois", // the breadcrumb
  contest: "Combat", // the breadcrumb's last step when the stage is not known
  heading: "{white} vs {blue}, {round}, {weight}, {competition}",
  result: {
    title: "Résultat du combat",
    athlete: "Athlète",
    // the scores: ippon, waza-ari, yuko
    ippon: "I",
    wazaari: "W",
    yuko: "Y",
    shido: "Shido",
    result: "Résultat",
    win: "Victoire",
    notFoughtYet: "Pas encore disputé",
    walkover: "Forfait",
    notRated: "non coté",
    time: "Temps",
    goldenScore: "GS",
  },
  walkover: {
    title: "Variation de cote",
    howRatingsWork: "Comment fonctionne la cote",
    fusen: "Forfait : {name} ne s’est pas présenté (fusen-gachi).",
    nothingFought: "Forfait : rien n’a été combattu, ni chrono ni score.",
    noChange: "Une victoire sans combat ne dit rien sur le plus fort, donc elle ne change aucune des deux cotes.",
  },
  ratingChange: {
    title: "Variation de cote",
    ifWins: "Si cet athlète gagne",
    wins: "{name} gagne", // the button that picks the winner of a contest to come
    howRatingsWork: "Comment fonctionne la cote",
    athlete: "Athlète",
    chance: "Chance",
    skill: "Force",
    rd: "RD",
    rating: "Cote",
    formula: "Cote = force − RD. Moins de RD, plus de cote.",
    picked: "Pas encore disputé : ce que ferait le résultat choisi.",
  },
  road: {
    title: "Parcours jusqu’à ce combat : {round}", // the stage in lower case
    titleContest: "Parcours jusqu’au combat",
    first: "Premier combat du tournoi.",
    upset: "Surprise",
    theContest: "Le combat",
  },
  meetings: {
    title: "Rencontres précédentes",
    level: "Égalité {white}–{blue}",
    leads: "{name} mène {more}–{fewer}",
    headToHead: "Face-à-face",
    first: "Leur première rencontre.",
    firstBefore: "Leur première rencontre : aucune avant celle-ci.",
  },
} satisfies typeof en.contest;
