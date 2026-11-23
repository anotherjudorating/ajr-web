// The rankings: the weights, pound for pound, the nations, their tables and the panel.

import type { en } from "@/i18n/en";

export const rankings = {
  teams: "Seleções",
  // WeightSwitcher: the small labels before the rows (a language may abbreviate)
  switcher: { men: "Masc.", women: "Fem.", teams: "Países" },
  breadcrumb: "Rankings",
  // "−73 kg": a weight in a list or a column
  weightKg: "{label} kg",
  // the <title> of a past day's table
  pastTitle: "{title} em {date}",
  loading: "Carregando…",
  // a weight's table (app/[lang]/rankings/[weight])
  weight: {
    title: "Ranking mundial de judô {weight}",
    strongest: "Os judocas mais fortes em {weight}",
    strongestOn: "Os judocas mais fortes em {weight} em {date}",
    description: "{strongest}: {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // pound for pound (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "Ranking de judô peso por peso, {gender}",
    description: "Os melhores judocas do {gender} em todas as categorias: quanto cada um está acima do resto da sua categoria.",
    breadcrumb: "Peso por peso, {gender}",
  },
  // the nations (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Ranking de países no judô, {who}",
    who: { men: "masculino", women: "feminino", mixed: "masculino e feminino" },
    description: "Qual país tem a seleção de judô mais forte: cada país avaliado pelo seu melhor atleta em cada categoria.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "Países, {gender}",
  },
  // TableParts: the toolbar over a table and the pages under it
  toolbar: {
    searchAthlete: "Buscar atleta",
    searchNation: "Buscar país",
    allCountries: "Todos os países",
    asOf: "Ranking nesta data",
    exportCsv: "Baixar CSV",
  },
  pagination: {
    range: "{from}–{to} de {count}", // "1–50 de 625 atletas"
    show: "Mostrar",
  },
  sorts: {
    ratingDesc: "Ordem: rating ↓",
    ratingAsc: "Ordem: rating ↑",
    d90Desc: "Ordem: +/− 90 dias ↓",
    d90Asc: "Ordem: +/− 90 dias ↑",
    d6mDesc: "Ordem: +/− 6 meses ↓",
    d6mAsc: "Ordem: +/− 6 meses ↑",
    ledDesc: "Ordem: top 1 ↓",
    top8Desc: "Ordem: top 8 ↓",
    leadDesc: "Ordem: vantagem ↓",
    leadAsc: "Ordem: vantagem ↑",
  },
  // the tables' header cells
  columns: {
    athlete: "Atleta",
    nat: "PAÍS",
    country: "País",
    weight: "Categoria",
    rating: "Rating",
    age: "Idade",
    last: "Última",
    trend: "Tendência",
    d90: "90 d",
    m6: "6 m",
    change6m: "+/- 6 m",
    lead: "Vantagem",
    nation: "País",
    top1: "Top 1",
    top8: "Top 8",
    leadersAvg: "Média líderes",
    leadersRatingAvg: "Média de rating dos líderes",
  },
  // what the header cells say on hover
  tips: {
    rank90: "Variação de posição nos últimos 90 dias",
    rating90: "Variação de rating nos últimos 90 dias",
    rank6m: "Variação de posição nos últimos 182 dias",
    rating6m: "Variação de rating nos últimos 182 dias",
    ijf: "Posição no ranking mundial da IJF",
    ijfDifference: "Posição na IJF comparada com a do AJR: ↓ mais baixa na IJF, ↑ mais alta",
    lead: "Pontos acima da média dos 7 seguintes da própria categoria",
    top1: "Categorias em que o país tem o melhor atleta de todos os países",
    top8: "Categorias em que o melhor atleta do país está entre os 8 melhores países",
    leadersAvg:
      "Média de rating do melhor atleta do país em cada uma das {weights} categorias. Uma categoria sem atleta conta como o último lugar daquela tabela",
  },
  // the rating cell's tip: how the shown rating is made
  score: {
    glicko: "Rating Glicko-2",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Mostrar os últimos 90 dias",
  noAthletes: "Nenhum atleta com esses filtros.",
  noNations: "Nenhum país com esses filtros.",
  // Changes: an athlete not in the table back then
  changes: {
    new: "NOVO",
    returning: "VOLTA",
  },
  // AthletePanel: the expanded row
  panel: {
    ijf: "Ranking mundial IJF",
    last90: "Últimos 90 dias",
    failed: "Não foi possível carregar as lutas.",
    none: "Nenhuma luta nos últimos 90 dias.",
    upset: "Surpresa",
    won: "V",
    lost: "D",
    contest: "A luta",
  },
  // Medal: the aria-label
  medal: {
    gold: "ouro",
    silver: "prata",
    bronze: "bronze",
    predicted: "Previsão: {kind}",
  },
  // chart.tsx: the names of a line's points and its tips
  chart: {
    today: "Hoje",
    weekOf: "Semana de {date}",
    quarter: "{n}º tri {year}",
    inactive: "inativo",
    rank: "Posição",
    peak: "Pico {score}",
  },
} satisfies typeof en.rankings;
