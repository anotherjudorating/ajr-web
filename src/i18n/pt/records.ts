// The records: the overview, each record page, the columns. The records themselves
// (slugs, backend names, kinds, views) are in lib/records.ts; their text is here, by
// the record's slug, and components/records/text.ts joins the two.

import type { en } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";

// Marks a record's text, so that every entry has the one type (a title may break
// where English does not).
const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "Recordes históricos do judô",
    description: "Recordes históricos do judô: maiores ratings, mais tempo em 1º, mais medalhas, maiores surpresas e outros.",
  },
  // "Maior rating, recorde do judô": a record page's title tag
  pageTitle: "{title}, recorde do judô",
  title: "Recordes",
  // {judobase} is the link to the IJF database, with the text below.
  lead: "As melhores marcas de todos os tempos, só com as lutas disponíveis no {judobase}, desde 2009.",
  judobase: "IJF judobase",
  howRatingsWork: "Como funciona o rating",
  // The tabs of /records.
  groups: {
    ratings: "Ratings",
    medals: "Medalhas",
    contests: "Lutas",
    rivalries: "Rivalidades",
    tournaments: "Torneios",
    nations: "Países",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Recordes", // before the group tabs
    groupsLabel: "Grupos de recordes", // the tabs' aria-label
    athletes: "Atletas", // before the Men/Women filter
    all: "Todos",
    fullList: "Lista completa",
  },
  viewSwitch: {
    label: "Visão",
  },
  // A record's full list (components/records/RecordBrowser.tsx).
  browser: {
    // The search box, by what one row is about.
    search: {
      athlete: "Buscar atleta",
      tournament: "Buscar torneio",
      nation: "Buscar país",
    },
    menAndWomen: "Masculino e feminino",
    allWeights: "Todas as categorias",
    sortValueDesc: "Ordem: {label} ↓",
    sortValueAsc: "Ordem: {label} ↑",
    sortDateDesc: "Ordem: data ↓",
    sortDateAsc: "Ordem: data ↑",
    exportCsv: "Baixar CSV",
    empty: "Nada com esses filtros.",
  },
  // The headers of the records' tables (components/records/columns.tsx).
  columns: {
    athlete: "Atleta",
    nat: "País",
    weight: "Categoria",
    // "Masculino −73": a row's weight without the unit
    weightName: "{gender} {label}",
    peak: "Pico",
    date: "Data",
    weeks: "Semanas",
    until: "Até",
    lead: "Vantagem",
    age: "Idade",
    total: "Total",
    inARow: "Seguidas",
    period: "Período",
    tournament: "Torneio",
    wins: "Vitórias",
    avgChance: "Chance média",
    overNo1: "Sobre o 1º",
    upsetWins: "Surpresas",
    winnerLoser: "Vencedor / perdedor",
    chance: "Chance",
    avgRating: "Rating médio",
    avg: "Média", // the same header on phones
    avgRatingTip: "Rating médio dos inscritos",
    nations: "Países",
    nationsTip: "Países com ao menos uma medalha",
    upsets: "Surpresas",
    upsetsTip: "Lutas que o favorito do rating perdeu",
    favWon: "Fav. venceu",
    favWonTip: "Lutas vencidas pelo favorito do rating",
    rating: "Rating",
    golds: "Ouros",
    medals: "Medalhas",
    years: "Anos",
    finals: "Finais",
    won: "Vencidas",
    wonShare: "Vencidas %",
    contests: "Lutas",
    time: "Tempo",
    athletes: "Atletas",
    meetings: "Encontros",
    score: "Placar",
    nemesisOpponent: "Carrasco / adversário",
    weights: "Categorias",
    inTop10: "No top 10",
    nation: "País",
  },
  // Each record's text, by its slug (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Maior rating",
      description: "O maior rating que cada atleta alcançou desde 2011, uma linha por atleta.",
      noun: "athletes",
      sortLabel: "pico",
    }),
    "longest-at-1": record({
      title: "Mais tempo em 1º",
      description: "Semanas em 1º no ranking de uma categoria desde 2011, no total. A categoria é a que tem mais semanas.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "Seguidas", description: "A maior sequência sem interrupção em 1º no ranking de uma categoria desde 2011." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Mais semanas no top 8",
      breakAfter: "Mais semanas",
      description:
        "Semanas no top 8 do ranking de uma categoria (os cabeças de chave de um Mundial ou de uma Olimpíada) desde 2011, no total. Uma semana conta uma vez mesmo que o atleta estivesse em duas categorias.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": { label: "Seguidas", description: "A maior sequência sem interrupção no top 8 do ranking de uma categoria desde 2011." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Mais tempo em 1º P4P",
      breakAfter: "Mais tempo",
      description: "Semanas em 1º no ranking peso por peso, masculino e feminino separados, desde 2011, no total.",
      noun: "athletes",
      sortLabel: "semanas",
      views: {
        total: { label: "Total" },
        "in-a-row": {
          label: "Seguidas",
          description: "A maior sequência sem interrupção em 1º no ranking peso por peso, masculino e feminino separados, desde 2011.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Maior vantagem P4P",
      description: "A maior vantagem de um 1º peso por peso sobre os 7 melhores da sua categoria, desde 2011.",
      noun: "athletes",
      sortLabel: "vantagem",
    }),
    "youngest-1": record({
      title: "Nº 1 mais jovem",
      description: "Os atletas mais jovens a chegar ao 1º lugar do ranking de uma categoria desde 2011. Idade pelo ano de nascimento.",
      noun: "athletes",
      sortLabel: "idade",
    }),
    "most-world-tour-medals": record({
      title: "Mais medalhas no World Tour",
      breakAfter: "Mais medalhas",
      description: "Medalhas em eventos do World Tour da IJF e nos Jogos Olímpicos, uma linha por atleta.",
      noun: "athletes",
      sortLabel: "medalhas",
      views: {
        total: { label: "Total" },
        gold: { label: "Ouro", description: "Medalhas de ouro em eventos do World Tour da IJF e nos Jogos Olímpicos, uma linha por atleta." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Mais medalhas seguidas",
      description: "Eventos do World Tour da IJF e Jogos Olímpicos seguidos terminados com medalha.",
      noun: "athletes",
      sortLabel: "seguidas",
      views: {
        total: { label: "Total" },
        gold: { label: "Ouro", description: "Eventos do World Tour da IJF e Jogos Olímpicos vencidos em sequência." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Medalha de Grand Slam mais jovem",
      breakAfter: "Medalha de Grand Slam",
      description: "Os atletas mais jovens a ganhar uma medalha de Grand Slam. Idade pelo ano de nascimento.",
      noun: "athletes",
      sortLabel: "idade",
      views: {
        any: { label: "Qualquer medalha" },
        gold: { label: "Ouro", description: "Os campeões de Grand Slam mais jovens. Idade pelo ano de nascimento." },
      },
    }),
    "longest-medal-span": record({
      title: "Maior intervalo entre medalhas",
      breakAfter: "Maior intervalo",
      description: "O maior número de anos entre a primeira e a última medalha de um atleta em eventos do World Tour da IJF e nos Jogos Olímpicos.",
      noun: "athletes",
      sortLabel: "anos",
    }),
    "best-finals-record": record({
      title: "Melhor aproveitamento em finais",
      breakAfter: "Melhor aproveitamento",
      description: "A parcela de finais vencidas em eventos do World Tour da IJF e nos Jogos Olímpicos, para atletas com ao menos 10 finais.",
      noun: "athletes",
      sortLabel: "vencidas",
    }),
    "least-likely-champion": record({
      title: "Campeão menos provável",
      breakAfter: "Campeão",
      description: "Campeões do World Tour a quem o rating deu a menor chance de vencer todas as lutas da sua chave, desde 2011.",
      noun: "titles",
      sortLabel: "chance",
    }),
    "longest-winning-streak": record({
      title: "Maior sequência de vitórias",
      breakAfter: "Maior sequência",
      description: "Lutas vencidas em sequência.",
      noun: "athletes",
      sortLabel: "vitórias",
    }),
    "biggest-upsets": record({
      title: "Maiores surpresas",
      description: "Vitórias sobre um atleta do top 10 da categoria a que o rating deu a menor chance antes da luta, desde 2011.",
      noun: "contests",
      sortLabel: "chance",
    }),
    "giant-killer": record({
      title: "Caçador de gigantes",
      description: "Vitórias como azarão sobre atletas que estavam no top 10 da categoria na época, desde 2011.",
      noun: "athletes",
      sortLabel: "vitórias surpresa",
    }),
    "golden-score-king": record({
      title: "Rei do golden score",
      description: "Lutas vencidas no golden score, desde 2017.",
      noun: "athletes",
      sortLabel: "vitórias no golden score",
    }),
    "longest-contest": record({
      title: "Luta mais longa",
      description: "As lutas mais longas do World Tour, golden score incluído.",
      noun: "contests",
      sortLabel: "tempo",
    }),
    "greatest-rivalry": record({
      title: "Maior rivalidade",
      description:
        "As duplas que mais se enfrentaram no topo e de forma mais equilibrada. Cada encontro vale pelo rating do atleta mais fraco antes dele, de 0 em 1900 a 1 em 2500, e a soma diminui quando o confronto é desigual: Σ min(1, max(0, (rating − 1900) / 600)) × (1 − ((vitórias − derrotas) / encontros)²).",
      noun: "rivalries",
      sortLabel: "placar",
    }),
    "longest-rivalry": record({
      title: "Rivalidade mais longa",
      breakAfter: "Rivalidade",
      description:
        "O maior número de anos entre o primeiro e o último encontro de uma dupla. Uma dupla que se enfrentou poucas vezes vale menos: anos × (encontros − 1) / (encontros + 1).",
      noun: "rivalries",
      sortLabel: "placar",
    }),
    nemesis: record({
      title: "Carrasco",
      description:
        "Atletas que venceram repetidamente um adversário mais forte. Só contam os encontros em que o rating os fazia azarões: cada um soma a vitória além da chance que tinham, mais quanto mais forte era o adversário: Σ (vitória − chance) × min(1, max(0, (rating do adversário − 1900) / 600)).",
      noun: "pairs",
      sortLabel: "placar",
    }),
    "strongest-tournament": record({
      title: "Torneio mais forte",
      description: "O rating médio, antes do torneio, dos 8 melhores inscritos de cada categoria, desde 2011.",
      noun: "tournaments",
      sortLabel: "rating médio",
    }),
    "most-nations-on-the-podium": record({
      title: "Mais países no pódio",
      description: "Torneios cujas medalhas foram para o maior número de países.",
      noun: "tournaments",
      sortLabel: "países",
    }),
    "most-unpredictable-tournament": record({
      title: "Torneio mais imprevisível",
      breakAfter: "Torneio",
      description: "Torneios cujas lutas o rating previu pior (o maior log loss), desde 2011.",
      noun: "tournaments",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Maior rating de seleção",
      breakAfter: "Maior rating",
      description: "O maior rating de seleção que cada país alcançou desde 2011.",
      noun: "nations",
      sortLabel: "rating",
    }),
    "most-medals": record({
      title: "Mais medalhas",
      description: "Medalhas em eventos do World Tour da IJF e nos Jogos Olímpicos, por país.",
      noun: "nations",
      sortLabel: "medalhas",
    }),
    "deepest-team": record({
      title: "Elenco mais profundo",
      description: "O maior número de atletas de um país no top 10 das suas categorias em um mesmo dia, desde 2011.",
      noun: "nations",
      sortLabel: "atletas",
    }),
  },
} satisfies typeof en.records;
