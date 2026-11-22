// Страница спортсмена: шапка, графики, схватки, списки.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const athlete = {
  // Заголовок и описание для поисковиков (app/[lang]/athletes/[id]/page.tsx).
  meta: {
    title: "{name}: рейтинг и результаты в дзюдо",
    // «Heydarov H. (Azerbaijan, 1997 г. р.): №1 в категории мужчины −73 кг, рейтинг 2543, пик 2600 в июл 2024.»
    summary: "{name} ({who}): {standing}{peak}.",
    summaryNoWho: "{name}: {standing}{peak}.", // без страны и года рождения
    born: "{year} г. р.",
    judo: "дзюдо", // вес неизвестен
    ranked: "№{place} в категории {where}, рейтинг {score}",
    unranked: "категория {where}, вне таблицы (год без схваток)",
    peak: ", пик {score} в {month}", // после места; пусто без пика
  },
  // «−73 кг»: вкладка веса, пункт фильтра, легенда графика мест
  weightKg: "{weight} кг",
  header: {
    age: forms({ one: "{n} год", few: "{n} года", many: "{n} лет", other: "{n} года" }),
    rank: "Место",
    best: "Лучшее",
    peak: "Пик",
    inactive: "Неактивен",
    inactiveTitle: "Больше года без схваток: вне таблиц до следующей",
    tableOfWeek: "Таблица той недели",
    ijfTitle: "Место в мировом рейтинге IJF. ↑ в IJF выше, чем в AJR, ↓ ниже. Открывает профиль спортсмена на сайте IJF.",
    showOnChart: "Показать на графике",
    // недели на 1-м месте: шапка маленькой таблицы и её строки
    weeks: "Недели",
    total: "Всего",
    longestRun: "Подряд",
    atOne: "№1",
    p4pAtOne: "№1 P4P",
    // подпись серии, отмеченной на графике мест
    weeksAtOne: forms({ one: "{n} неделя на 1-м месте", few: "{n} недели на 1-м месте", many: "{n} недель на 1-м месте", other: "{n} недели на 1-м месте" }),
    weeksP4pAtOne: forms({ one: "{n} неделя №1 P4P", few: "{n} недели №1 P4P", many: "{n} недель №1 P4P", other: "{n} недели №1 P4P" }),
    weeksTop8: forms({ one: "{n} неделя в топ-8", few: "{n} недели в топ-8", many: "{n} недель в топ-8", other: "{n} недели в топ-8" }),
    firstAtOne: "Первое №1 в возрасте {age}", // неделя рекорда: первая неделя на 1-м месте, с возрастом
    currentRating: "Текущий рейтинг",
    lastRating: "Последний рейтинг, {month}", // у неактивного спортсмена
    change: "Период",
    rating: "Рейтинг",
    days90: "90 дней",
    months6: "6 мес.",
    skill: "сила",
    uncertainty: "неопределённость",
    howItWorks: "Как это устроено",
  },
  chart: {
    rating: "Рейтинг",
    rank: "Место",
    ratingOrRank: "Рейтинг или место", // aria-label переключателя
    // окна каждого графика рейтинга (и очных встреч)
    ranges: { "1Y": "1г", "4Y": "4г", All: "Всё" },
    peakPeriod: "Пик, {date}", // точка пика в подсказке
    inactive: "Неактивен",
    inactiveZone: "Больше года без схваток: вне таблиц до следующей. Сила сохраняется, неопределённость растёт, и рейтинг сползает вниз.",
    inactiveLegend: "Больше года без схваток: вне таблиц",
    skillLabel: "Сила {n}",
    uncertaintyLabel: "−{n} неопределённость",
    ratingLabel: "Рейтинг {n}",
    peakLabel: "Пик {score}",
    peakBefore: "Пик в {month}: показать всю карьеру", // пик раньше окна
    showContests: "Показать схватки",
    takeMarkOff: "Снять отметку",
    takeMarkOffEsc: "Снять отметку (Esc)",
    // подпись отмеченной серии с месяцами: «12 недель на 1-м месте, янв 2024 – мар 2024»
    runInMonth: "{label}, {month}",
    runOverMonths: "{label}, {from} – {to}",
    skill: "Сила",
    uncertainty: "Неопределённость",
    top8: "Топ-8",
    // подсказка графика мест
    weekOf: "Неделя с {date}",
    placeIn: "№{place} в {weight} кг",
    notInTable: "Нет в таблице {weight} кг",
    p4pPlace: "P4P №{place}",
    placeP4p: "№{place} вне весовых категорий",
  },
  contests: {
    title: "Схватки",
    search: "Поиск соперника или турнира",
    allYears: "Все годы",
    weight: "Вес",
    allWeights: "Все веса",
    level: "Уровень турнира",
    allLevels: "Все уровни",
    // фильтр по результату, по значению ("" все схватки)
    results: { "": "Все схватки", w: "Победы", l: "Поражения", uw: "Победы-сенсации", ul: "Поражения-сенсации" },
    sorts: {
      "date-desc": "Сортировка: дата ↓",
      "date-asc": "Сортировка: дата ↑",
      "chance-asc": "Сортировка: шанс ↑",
      "chance-desc": "Сортировка: шанс ↓",
      "gain-desc": "Сортировка: изменение рейтинга ↓",
      "gain-asc": "Сортировка: изменение рейтинга ↑",
    },
    exportCsv: "Скачать CSV",
    round: "Стадия",
    opponent: "Соперник",
    date: "Дата",
    opponentRating: "Соп.",
    chance: "Шанс",
    result: "Итог",
    upset: "Сенсация",
    win: "В",
    loss: "П",
    theContest: "Схватка",
    noMatch: "По этим фильтрам схваток нет.",
    range: "{from}–{to} из {total}", // «1–25 из 112 схваток»
    show: "Показывать",
  },
  lists: {
    bestWins: "Лучшие победы",
    toughestLosses: "Самые обидные поражения",
    all: "Все",
    opponentRating: "Рейтинг соперника перед схваткой",
    noneYet: "Пока нет.",
    frequentOpponents: "Частые соперники",
    noRepeat: "Повторных соперников пока нет.",
    liveAndUpcoming: "Сейчас и скоро",
    dates: "Даты",
    tournament: "Турнир",
    gold: "Золото",
    medal: "Медаль",
    live: "Идёт",
  },
  results: {
    title: "Результаты",
    level: "Уровень",
    // подсказки медальных колонок
    medals: { gold: "золото", silver: "серебро", bronze: "бронза" },
    fifth: "Пятое место",
    seventh: "Седьмое место",
    other: "Прочее",
    otherTitle: "Выбыл раньше или результат, которого judobase не даёт",
    total: "Всего",
    totalTitle: "Турниров сыграно",
    // уровни, не помещающиеся в строку телефона, по id (lib/levels.ts)
    short: {
      worlds: "Чемп. мира",
      continental: "Конт. чемпионаты",
      opens: "Open и кубки",
    },
  },
} satisfies typeof en.athlete;
