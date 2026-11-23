// A contest's page.

import type { en } from "@/i18n/en";

export const contest = {
  meta: {
    names: "{white} vs {blue}",
    title: "{names}: {round}, {competition}",
    noRound: "combate", // a contest whose stage is not known
  },
  tournaments: "Torneos", // the breadcrumb
  contest: "Combate", // the breadcrumb's last step when the stage is not known
  heading: "{white} vs {blue}: {round}, {weight}, {competition}",
  result: {
    title: "Resultado del combate",
    athlete: "Atleta",
    // the scores: ippon, waza-ari, yuko
    ippon: "I",
    wazaari: "W",
    yuko: "Y",
    shido: "Shido",
    result: "Resultado",
    win: "Victoria",
    notFoughtYet: "Aún sin disputar",
    walkover: "Incomparecencia",
    notRated: "sin rating",
    time: "Tiempo",
    goldenScore: "GS",
  },
  walkover: {
    title: "Cambio de rating",
    howRatingsWork: "Cómo funciona el rating",
    fusen: "Incomparecencia: {name} no salió a combatir (fusen-gachi).",
    nothingFought: "Incomparecencia: no hubo combate, ni tiempo ni marcador.",
    noChange: "Una victoria sin combate no dice nada sobre quién es más fuerte, así que no cambia ningún rating.",
  },
  ratingChange: {
    title: "Cambio de rating",
    ifWins: "Si gana este atleta",
    wins: "Gana {name}", // the button that picks the winner of a contest to come
    howRatingsWork: "Cómo funciona el rating",
    athlete: "Atleta",
    chance: "Prob.",
    skill: "Fuerza",
    rd: "RD",
    rating: "Rating",
    formula: "Rating = fuerza − RD. A menor RD, mayor rating.",
    picked: "Aún sin disputar: lo que haría el resultado elegido.",
  },
  road: {
    title: "Camino hasta el combate: {round}", // the stage in lower case
    titleContest: "Camino hasta el combate",
    first: "Primer combate del torneo.",
    upset: "Sorpresa",
    theContest: "El combate",
  },
  meetings: {
    title: "Enfrentamientos anteriores",
    level: "Empate {white}–{blue}",
    leads: "{name} domina {more}–{fewer}",
    headToHead: "Cara a cara",
    first: "Su primer enfrentamiento.",
    firstBefore: "Su primer enfrentamiento: ninguno antes de este.",
  },
} satisfies typeof en.contest;
