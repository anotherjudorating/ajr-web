// A contest's page.

import type { en } from "@/i18n/en";

export const contest = {
  meta: {
    names: "{white} x {blue}",
    title: "{names}: {round}, {competition}",
    noRound: "luta", // a contest whose stage is not known
  },
  tournaments: "Torneios", // the breadcrumb
  contest: "Luta", // the breadcrumb's last step when the stage is not known
  heading: "{white} x {blue}: {round}, {weight}, {competition}",
  result: {
    title: "Resultado da luta",
    athlete: "Atleta",
    // the scores: ippon, waza-ari, yuko
    ippon: "I",
    wazaari: "W",
    yuko: "Y",
    shido: "Shido",
    result: "Resultado",
    win: "Vitória",
    notFoughtYet: "Ainda não disputada",
    walkover: "WO",
    notRated: "sem rating",
    time: "Tempo",
    goldenScore: "GS",
  },
  walkover: {
    title: "Variação de rating",
    howRatingsWork: "Como funciona o rating",
    fusen: "WO: {name} não entrou no tatame (fusen-gachi).",
    nothingFought: "WO: ninguém lutou, sem tempo e sem pontuação.",
    noChange: "Uma vitória sem luta não diz nada sobre quem é mais forte, por isso não muda nenhum dos ratings.",
  },
  ratingChange: {
    title: "Variação de rating",
    ifWins: "Se este atleta vencer",
    wins: "{name} vence", // the button that picks the winner of a contest to come
    howRatingsWork: "Como funciona o rating",
    athlete: "Atleta",
    chance: "Chance",
    skill: "Força",
    rd: "RD",
    rating: "Rating",
    formula: "Rating = força − RD. RD menor, rating maior.",
    picked: "Ainda não disputada: o que o resultado escolhido faria.",
  },
  road: {
    title: "Caminho até esta luta ({round})", // the stage in lower case: "a quartas de final" would not agree, so the stage goes in brackets
    titleContest: "Caminho até a luta",
    first: "Primeira luta do torneio.",
    upset: "Surpresa",
    theContest: "A luta",
  },
  meetings: {
    title: "Confrontos anteriores",
    level: "Empate em {white}–{blue}",
    leads: "{name} lidera por {more}–{fewer}",
    headToHead: "Confronto direto",
    first: "Primeiro confronto entre os dois.",
    firstBefore: "Primeiro confronto entre os dois: nenhum antes deste.",
  },
} satisfies typeof en.contest;
