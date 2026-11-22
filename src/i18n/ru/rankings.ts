// Рейтинги: веса, P4P, сборные, их таблицы и панель спортсмена.

import type { en } from "@/i18n/en";

export const rankings = {
  teams: "Сборные",
  // WeightSwitcher: короткие подписи перед строками
  switcher: { men: "Муж", women: "Жен", teams: "Сборные" },
  breadcrumb: "Рейтинги",
  // «−73 кг»: вес в списке или колонке
  weightKg: "{label} кг",
  // <title> таблицы на прошедший день
  pastTitle: "{title} на {date}",
  loading: "Загрузка…",
  // таблица веса (app/[lang]/rankings/[weight])
  weight: {
    title: "{weight}: мировой рейтинг дзюдо",
    strongest: "Сильнейшие дзюдоисты, {weight}",
    strongestOn: "Сильнейшие дзюдоисты, {weight}, на {date}",
    description: "{strongest}: {leaders}.",
    descriptionShort: "{strongest}.",
  },
  // P4P (app/[lang]/rankings/p4p/[gender])
  p4p: {
    title: "{gender}: рейтинг дзюдо P4P, вне весовых категорий",
    description: "Сильнейшие дзюдоисты ({gender}) без учёта веса: насколько каждый оторвался от остальных в своей категории.",
    breadcrumb: "{gender}, P4P",
  },
  // сборные (app/[lang]/rankings/teams/[kind])
  nations: {
    title: "Рейтинг сборных по дзюдо, {who}",
    who: { men: "мужчины", women: "женщины", mixed: "мужчины и женщины" },
    description: "У какой страны сильнейшая команда в дзюдо: каждая сборная оценена по лучшему спортсмену в каждом весе.",
    descriptionTop: "{description} {top}.",
    breadcrumb: "{gender}, сборные",
  },
  // TableParts: панель над таблицей и страницы под ней
  toolbar: {
    searchAthlete: "Поиск спортсмена",
    searchNation: "Поиск страны",
    allCountries: "Все страны",
    asOf: "Рейтинг на эту дату",
    exportCsv: "Скачать CSV",
  },
  pagination: {
    range: "{from}–{to} из {count}", // «1–50 из 625 спортсменов»
    show: "Показывать",
  },
  sorts: {
    ratingDesc: "Сортировка: рейтинг ↓",
    ratingAsc: "Сортировка: рейтинг ↑",
    d90Desc: "Сортировка: +/− 90 дней ↓",
    d90Asc: "Сортировка: +/− 90 дней ↑",
    d6mDesc: "Сортировка: +/− 6 месяцев ↓",
    d6mAsc: "Сортировка: +/− 6 месяцев ↑",
    ledDesc: "Сортировка: топ-1 ↓",
    top8Desc: "Сортировка: топ-8 ↓",
    leadDesc: "Сортировка: отрыв ↓",
    leadAsc: "Сортировка: отрыв ↑",
  },
  // заголовки колонок
  columns: {
    athlete: "Спортсмен",
    nat: "Стр.",
    country: "Страна",
    weight: "Вес",
    rating: "Рейтинг",
    age: "Возраст",
    last: "Посл.",
    trend: "Тренд",
    d90: "90 дн.",
    m6: "6 мес.",
    change6m: "+/− 6 мес.",
    lead: "Отрыв",
    nation: "Страна",
    top1: "Топ-1",
    top8: "Топ-8",
    leadersAvg: "Средн. лидеров",
    leadersRatingAvg: "Средний рейтинг лидеров",
  },
  // подсказки заголовков
  tips: {
    rank90: "Изменение места за 90 дней",
    rating90: "Изменение рейтинга за 90 дней",
    rank6m: "Изменение места за 182 дня",
    rating6m: "Изменение рейтинга за 182 дня",
    ijf: "Место в мировом рейтинге IJF",
    ijfDifference: "Место в IJF по сравнению с AJR: ↓ в IJF ниже, ↑ выше",
    lead: "Отрыв в очках от среднего рейтинга следующих семи в своём весе",
    top1: "Веса, где у страны сильнейший спортсмен среди всех стран",
    top8: "Веса, где лучший спортсмен страны входит в восьмёрку лучших стран",
    leadersAvg:
      "Средний рейтинг лучшего спортсмена страны в каждом из {weights} весов. Вес без спортсмена считается как последнее место его таблицы",
  },
  // подсказка в ячейке рейтинга: из чего он складывается
  score: {
    glicko: "Рейтинг Glicko-2",
    minusRd: "− RD ({rd})",
  },
  showLast90: "Показать последние 90 дней",
  noAthletes: "По этим фильтрам спортсменов нет.",
  noNations: "По этим фильтрам стран нет.",
  // Changes: спортсмена не было в таблице тогда
  changes: {
    new: "НОВ",
    returning: "ВОЗВ",
  },
  // AthletePanel: раскрытая строка
  panel: {
    ijf: "Мировой рейтинг IJF",
    last90: "Последние 90 дней",
    failed: "Не удалось загрузить схватки.",
    none: "За последние 90 дней схваток не было.",
    upset: "Сенсация",
    won: "В",
    lost: "П",
    contest: "Схватка",
  },
  // Medal: aria-label
  medal: {
    gold: "золото",
    silver: "серебро",
    bronze: "бронза",
    predicted: "Прогноз: {kind}",
  },
  // chart.tsx: названия точек линии и подсказки
  chart: {
    today: "Сегодня",
    weekOf: "Неделя с {date}",
    quarter: "{n}-й кв. {year}",
    inactive: "неактивен",
    rank: "Место",
    peak: "Пик {score}",
  },
} satisfies typeof en.rankings;
