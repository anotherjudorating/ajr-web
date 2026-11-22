// Рекорды: обзор, страницы рекордов, колонки. Сами рекорды (слаги, имена в бэкенде,
// виды) в lib/records.ts, их текст здесь, по слагу. `noun` называет форму счётчика в
// common («athletes» → «625 спортсменов»).

import type { en } from "@/i18n/en";
import type { RecordText } from "@/i18n/en/records";

const record = (text: RecordText): RecordText => text;

export const records = {
  meta: {
    title: "Рекорды дзюдо за всё время",
    description: "Рекорды дзюдо за всё время: высшие рейтинги, самые долгие лидерства, больше всех медалей, главные сенсации и другие.",
  },
  // «Высший рейтинг: рекорд дзюдо»: title страницы рекорда
  pageTitle: "{title}: рекорд дзюдо",
  title: "Рекорды",
  // {judobase} - ссылка на базу IJF с текстом ниже.
  lead: "Лучшие показатели за всё время, только по схваткам из {judobase}, с 2009 года.",
  judobase: "IJF judobase",
  howRatingsWork: "Как устроен рейтинг",
  // Вкладки /records.
  groups: {
    ratings: "Рейтинги",
    medals: "Медали",
    contests: "Схватки",
    rivalries: "Противостояния",
    tournaments: "Турниры",
    nations: "Страны",
  },
  // /records (components/records/RecordsOverview.tsx).
  overview: {
    label: "Рекорды", // перед вкладками групп
    groupsLabel: "Группы рекордов", // aria-label вкладок
    athletes: "Спортсмены", // перед фильтром мужчины/женщины
    all: "Все",
    fullList: "Список",
  },
  viewSwitch: {
    label: "Вид",
  },
  // Полный список рекорда (components/records/RecordBrowser.tsx).
  browser: {
    // Поле поиска, по тому, о чём одна строка.
    search: {
      athlete: "Поиск спортсмена",
      tournament: "Поиск турнира",
      nation: "Поиск страны",
    },
    menAndWomen: "Мужчины и женщины",
    allWeights: "Все веса",
    sortValueDesc: "Сортировка: {label} ↓",
    sortValueAsc: "Сортировка: {label} ↑",
    sortDateDesc: "Сортировка: дата ↓",
    sortDateAsc: "Сортировка: дата ↑",
    exportCsv: "Скачать CSV",
    empty: "По этим фильтрам ничего нет.",
  },
  // Заголовки таблиц рекордов (components/records/columns.tsx).
  columns: {
    athlete: "Спортсмен",
    nat: "Стр.",
    weight: "Вес",
    // «Мужчины −73»: вес строки без единицы
    weightName: "{gender} {label}",
    peak: "Пик",
    date: "Дата",
    weeks: "Недели",
    until: "До",
    lead: "Отрыв",
    age: "Возраст",
    total: "Всего",
    inARow: "Подряд",
    period: "Период",
    tournament: "Турнир",
    wins: "Победы",
    avgChance: "Ср. шанс",
    overNo1: "Над №1",
    upsetWins: "Сенсации",
    winnerLoser: "Победитель / проигравший",
    chance: "Шанс",
    avgRating: "Ср. рейтинг",
    avg: "Ср.", // тот же заголовок на телефоне
    avgRatingTip: "Средний рейтинг участников",
    nations: "Страны",
    nationsTip: "Страны хотя бы с одной медалью",
    upsets: "Сенсации",
    upsetsTip: "Схватки, проигранные фаворитом по рейтингу",
    favWon: "Фаворит",
    favWonTip: "Схватки, выигранные фаворитом по рейтингу",
    rating: "Рейтинг",
    golds: "Золото",
    medals: "Медали",
    years: "Лет",
    finals: "Финалы",
    won: "Выиграно",
    wonShare: "% побед",
    contests: "Схватки",
    time: "Время",
    athletes: "Спортсмены",
    meetings: "Встречи",
    score: "Счёт",
    nemesisOpponent: "Кто / кого",
    weights: "Веса",
    inTop10: "В топ-10",
    nation: "Страна",
  },
  // Текст каждого рекорда, по слагу (lib/records.ts).
  list: {
    "highest-rating": record({
      title: "Высший рейтинг",
      description: "Самый высокий рейтинг, которого достигал каждый спортсмен с 2011 года, по строке на спортсмена.",
      noun: "athletes",
      sortLabel: "пик",
    }),
    "longest-at-1": record({
      title: "Дольше всех на 1-м месте",
      breakAfter: "Дольше всех",
      description: "Недели на 1-м месте в рейтинге веса с 2011 года, всего. Вес тот, где недель больше.",
      noun: "athletes",
      sortLabel: "недели",
      views: {
        total: { label: "Всего" },
        "in-a-row": { label: "Подряд", description: "Самая длинная непрерывная серия на 1-м месте в рейтинге веса с 2011 года." },
      },
    }),
    "most-weeks-in-the-top-8": record({
      title: "Больше всех недель в топ-8",
      breakAfter: "Больше всех недель",
      description:
        "Недели в восьмёрке рейтинга веса (сеяные на чемпионате мира и Олимпиаде) с 2011 года, всего. Неделя считается один раз, даже если спортсмен стоял в двух весах.",
      noun: "athletes",
      sortLabel: "недели",
      views: {
        total: { label: "Всего" },
        "in-a-row": { label: "Подряд", description: "Самая длинная непрерывная серия в восьмёрке рейтинга веса с 2011 года." },
      },
    }),
    "longest-at-p4p-1": record({
      title: "Дольше всех №1 P4P",
      breakAfter: "Дольше всех",
      description: "Недели на 1-м месте рейтинга вне весовых категорий, мужчины и женщины отдельно, с 2011 года, всего.",
      noun: "athletes",
      sortLabel: "недели",
      views: {
        total: { label: "Всего" },
        "in-a-row": {
          label: "Подряд",
          description: "Самая длинная непрерывная серия на 1-м месте рейтинга вне весовых категорий, мужчины и женщины отдельно, с 2011 года.",
        },
      },
    }),
    "biggest-p4p-lead": record({
      title: "Самый большой отрыв P4P",
      breakAfter: "Самый большой",
      description: "Самый большой отрыв №1 вне весовых категорий от семи следующих в своём весе, с 2011 года.",
      noun: "athletes",
      sortLabel: "отрыв",
    }),
    "youngest-1": record({
      title: "Самый молодой №1",
      description: "Самые молодые спортсмены, поднявшиеся на 1-е место рейтинга веса с 2011 года. Возраст по году рождения.",
      noun: "athletes",
      sortLabel: "возраст",
    }),
    "most-world-tour-medals": record({
      title: "Больше всех медалей World Tour",
      breakAfter: "Больше всех",
      description: "Медали на турнирах IJF World Tour и Олимпийских играх, по строке на спортсмена.",
      noun: "athletes",
      sortLabel: "медали",
      views: {
        total: { label: "Всего" },
        gold: { label: "Золото", description: "Золотые медали на турнирах IJF World Tour и Олимпийских играх, по строке на спортсмена." },
      },
    }),
    "most-medals-in-a-row": record({
      title: "Больше всех медалей подряд",
      breakAfter: "Больше всех",
      description: "Турниры IJF World Tour и Олимпийские игры подряд, законченные с медалью.",
      noun: "athletes",
      sortLabel: "подряд",
      views: {
        total: { label: "Всего" },
        gold: { label: "Золото", description: "Турниры IJF World Tour и Олимпийские игры, выигранные подряд." },
      },
    }),
    "youngest-grand-slam-medal": record({
      title: "Самая ранняя медаль Grand Slam",
      breakAfter: "Самая ранняя",
      description: "Самые молодые призёры турниров Grand Slam. Возраст по году рождения.",
      noun: "athletes",
      sortLabel: "возраст",
      views: {
        any: { label: "Любая медаль" },
        gold: { label: "Золото", description: "Самые молодые победители турниров Grand Slam. Возраст по году рождения." },
      },
    }),
    "longest-medal-span": record({
      title: "Самая долгая медальная карьера",
      breakAfter: "Самая долгая",
      description: "Больше всего лет между первой и последней медалью спортсмена на турнирах IJF World Tour и Олимпийских играх.",
      noun: "athletes",
      sortLabel: "лет",
    }),
    "best-finals-record": record({
      title: "Лучший процент в финалах",
      breakAfter: "Лучший процент",
      description: "Доля выигранных финалов на турнирах IJF World Tour и Олимпийских играх, у спортсменов не меньше чем с 10 финалами.",
      noun: "athletes",
      sortLabel: "выиграно",
    }),
    "least-likely-champion": record({
      title: "Самый неожиданный чемпион",
      breakAfter: "Самый неожиданный",
      description: "Победители турниров World Tour, которым рейтинг давал меньше всего шансов выиграть все схватки своей сетки, с 2011 года.",
      noun: "titles",
      sortLabel: "шанс",
    }),
    "longest-winning-streak": record({
      title: "Самая длинная серия побед",
      breakAfter: "Самая длинная",
      description: "Схватки, выигранные подряд.",
      noun: "athletes",
      sortLabel: "победы",
    }),
    "biggest-upsets": record({
      title: "Главные сенсации",
      description: "Победы над спортсменами из десятки веса, которым рейтинг давал меньше всего шансов перед схваткой, с 2011 года.",
      noun: "contests",
      sortLabel: "шанс",
    }),
    "giant-killer": record({
      title: "Гроза фаворитов",
      description: "Победы аутсайдера над спортсменами, стоявшими тогда в десятке веса, с 2011 года.",
      noun: "athletes",
      sortLabel: "сенсации",
    }),
    "golden-score-king": record({
      title: "Король голден скора",
      description: "Схватки, выигранные в голден скоре, с 2017 года.",
      noun: "athletes",
      sortLabel: "победы в голден скоре",
    }),
    "longest-contest": record({
      title: "Самая долгая схватка",
      description: "Самые долгие схватки World Tour, включая голден скор.",
      noun: "contests",
      sortLabel: "время",
    }),
    "greatest-rivalry": record({
      title: "Главное противостояние",
      description:
        "Пары, которые встречались чаще всех на высоком уровне и на равных. Каждая встреча оценивается по рейтингу более слабого перед ней, от 0 при 1900 до 1 при 2500. Сумма уменьшается при одностороннем счёте: Σ min(1, max(0, (рейтинг − 1900) / 600)) × (1 − ((победы − поражения) / встречи)²).",
      noun: "rivalries",
      sortLabel: "счёт",
    }),
    "longest-rivalry": record({
      title: "Самое долгое противостояние",
      breakAfter: "Самое долгое",
      description:
        "Больше всего лет между первой и последней встречей пары. Пара, встречавшаяся лишь несколько раз, весит меньше: годы × (встречи − 1) / (встречи + 1).",
      noun: "rivalries",
      sortLabel: "счёт",
    }),
    nemesis: record({
      title: "Неудобный соперник",
      description:
        "Спортсмены, которые раз за разом обыгрывали более сильного. Считаются только встречи, где рейтинг делал их аутсайдером: каждая добавляет победу сверх данного шанса, и тем больше, чем сильнее был соперник: Σ (победа − шанс) × min(1, max(0, (рейтинг соперника − 1900) / 600)).",
      noun: "pairs",
      sortLabel: "счёт",
    }),
    "strongest-tournament": record({
      title: "Самый сильный турнир",
      description: "Средний рейтинг восьми сильнейших участников каждого веса перед турниром, с 2011 года.",
      noun: "tournaments",
      sortLabel: "ср. рейтинг",
    }),
    "most-nations-on-the-podium": record({
      title: "Больше всех стран на подиуме",
      breakAfter: "Больше всех стран",
      description: "Турниры, медали которых разошлись по наибольшему числу стран.",
      noun: "tournaments",
      sortLabel: "страны",
    }),
    "most-unpredictable-tournament": record({
      title: "Самый непредсказуемый турнир",
      breakAfter: "Самый непредсказуемый",
      description: "Турниры, схватки которых рейтинг предсказал хуже всего (самый высокий log loss), с 2011 года.",
      noun: "tournaments",
      sortLabel: "log loss",
    }),
    "highest-team-rating": record({
      title: "Высший рейтинг сборной",
      description: "Самый высокий рейтинг сборной, которого достигала каждая страна с 2011 года.",
      noun: "nations",
      sortLabel: "рейтинг",
    }),
    "most-medals": record({
      title: "Больше всех медалей",
      description: "Медали на турнирах IJF World Tour и Олимпийских играх, по странам.",
      noun: "nations",
      sortLabel: "медали",
    }),
    "deepest-team": record({
      title: "Самая длинная скамейка",
      breakAfter: "Самая длинная",
      description: "Больше всего спортсменов одной страны в десятках своих весов в один день, с 2011 года.",
      noun: "nations",
      sortLabel: "спортсмены",
    }),
  },
} satisfies typeof en.records;
