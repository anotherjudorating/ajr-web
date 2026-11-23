// An athlete's page: the header, the charts, the contests, the lists.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const athlete = {
  // The title and the description for search engines (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name}: rating e resultados no judô",
    // "Hidayat Heydarov (Azerbaijão, nascido em 1997): nº 1 em masculino −73 kg com rating 2543, pico 2600 em jul 2024."
    summary: "{name} ({who}): {standing}{peak}.",
    summaryNoWho: "{name}: {standing}{peak}.", // no nation and no year of birth
    born: "nascido em {year}",
    judo: "judô", // the weight is not known: "com rating no judô"
    ranked: "nº {place} em {where} com rating {score}",
    unranked: "com rating em {where}, fora da tabela (sem luta no último ano)",
    peak: ", pico {score} em {month}", // after the standing; empty without a peak
  },
  // "−73 kg": a weight tab, a filter's option, the Rank chart's legend
  weightKg: "{weight} kg",
  header: {
    age: forms({ other: "{n} anos" }),
    rank: "Posição",
    best: "Melhor",
    peak: "Pico",
    inactive: "Inativo",
    inactiveTitle: "Mais de um ano sem lutar: fora das tabelas até a próxima luta",
    tableOfWeek: "A tabela daquela semana",
    ijfTitle: "Posição no ranking mundial da IJF. ↑ mais alto na IJF do que no AJR, ↓ mais baixo. Abre o perfil do atleta na IJF.",
    showOnChart: "Mostrar no gráfico",
    // the weeks at #1: the heads of the small table and its rows
    weeks: "Semanas",
    total: "Total",
    longestRun: "Maior sequência",
    atOne: "Em 1º",
    p4pAtOne: "1º P4P",
    // the label of a run marked on the Rank chart
    weeksAtOne: forms({ one: "{n} semana em 1º", other: "{n} semanas em 1º" }),
    weeksP4pAtOne: forms({ one: "{n} semana em 1º peso por peso", other: "{n} semanas em 1º peso por peso" }),
    weeksTop8: forms({ one: "{n} semana no top 8", other: "{n} semanas no top 8" }),
    firstAtOne: "Primeiro 1º, aos {age}", // a record's week: the first week at #1, with the age
    currentRating: "Rating atual",
    lastRating: "Último rating, {month}", // an inactive athlete's
    change: "Variação",
    rating: "Rating",
    days90: "90 dias",
    months6: "6 meses",
    skill: "força",
    uncertainty: "incerteza",
    howItWorks: "Como funciona",
  },
  chart: {
    rating: "Rating",
    rank: "Posição",
    ratingOrRank: "Rating ou posição", // the switch's aria-label
    // the windows of every rating chart (the head-to-head's too)
    ranges: { "1Y": "1A", "4Y": "4A", All: "Tudo" },
    peakPeriod: "Pico, {date}", // the peak's point in the tip
    inactive: "Inativo",
    inactiveZone: "Mais de um ano sem lutar: fora das tabelas até a próxima luta. O rating fica guardado, a incerteza cresce e por isso o número cai devagar.",
    inactiveLegend: "Mais de um ano sem lutar: fora das tabelas",
    skillLabel: "Força {n}",
    uncertaintyLabel: "−{n} incerteza",
    ratingLabel: "Rating {n}",
    peakLabel: "Pico {score}",
    peakBefore: "Pico em {month}: mostrar toda a carreira", // the peak is before the window
    showContests: "Mostrar lutas",
    takeMarkOff: "Tirar a marca",
    takeMarkOffEsc: "Tirar a marca (Esc)",
    // a marked run's label with its months: "12 semanas em 1º, jan 2024 – mar 2024"
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Força",
    uncertainty: "Incerteza",
    top8: "Top 8",
    // the Rank chart's tip
    weekOf: "Semana de {date}",
    placeIn: "{place}º em {weight} kg",
    notInTable: "Fora da tabela de {weight} kg",
    p4pPlace: "P4P {place}º",
    placeP4p: "{place}º peso por peso",
  },
  contests: {
    title: "Lutas",
    search: "Buscar adversário ou torneio",
    allYears: "Todos os anos",
    weight: "Categoria",
    allWeights: "Todas as categorias",
    level: "Nível do torneio",
    allLevels: "Todos os níveis",
    // the result filter, by its value ("" is every contest)
    results: { "": "Todas as lutas", w: "Vitórias", l: "Derrotas", uw: "Vitórias surpresa", ul: "Derrotas surpresa" },
    sorts: {
      "date-desc": "Ordem: data ↓",
      "date-asc": "Ordem: data ↑",
      "chance-asc": "Ordem: chance ↑",
      "chance-desc": "Ordem: chance ↓",
      "gain-desc": "Ordem: variação de rating ↓",
      "gain-asc": "Ordem: variação de rating ↑",
    },
    exportCsv: "Baixar CSV",
    round: "Fase",
    opponent: "Adversário",
    date: "Data",
    opponentRating: "Adv.",
    chance: "Chance",
    result: "Resultado",
    upset: "Surpresa",
    win: "V",
    loss: "D",
    theContest: "A luta",
    noMatch: "Nenhuma luta com esses filtros.",
    range: "{from}–{to} de {total}", // "1–25 de 112 lutas"
    show: "Mostrar",
  },
  lists: {
    bestWins: "Melhores vitórias",
    toughestLosses: "Derrotas mais duras",
    all: "Todas",
    opponentRating: "Rating do adversário antes da luta",
    noneYet: "Nenhuma ainda.",
    frequentOpponents: "Adversários frequentes",
    noRepeat: "Nenhum adversário repetido ainda.",
    liveAndUpcoming: "Ao vivo e em breve",
    dates: "Datas",
    tournament: "Torneio",
    gold: "Ouro",
    medal: "Medalha",
    live: "Ao vivo",
  },
  results: {
    title: "Resultados",
    level: "Nível",
    // the medal columns' tooltips
    medals: { gold: "ouro", silver: "prata", bronze: "bronze" },
    fifth: "Quinto lugar",
    seventh: "Sétimo lugar",
    other: "Outros",
    otherTitle: "Eliminado antes, ou um resultado que o judobase não informa",
    total: "Total",
    totalTitle: "Torneios disputados",
    // the levels too long for one line of a phone, by their id (lib/levels.ts)
    short: {
      worlds: "Mundial",
      continental: "Continental",
      opens: "Opens e Copas",
    },
  },
} satisfies typeof en.athlete;
