// Страница страны.

import type { en } from "@/i18n/en";
import { forms } from "@/i18n/t";

export const country = {
  meta: {
    title: "{name}: рейтинг сборной по дзюдо и сильнейшие спортсмены",
    description: "{name} в дзюдо: сильнейшие дзюдоисты в каждом весе, турниры и медали.",
    descriptionPlaced: "{name} в дзюдо: №{place} среди сборных, сильнейшие дзюдоисты в каждом весе, турниры и медали.",
  },
  // хлебные крошки
  explore: "Каталог",
  nations: "Страны",
  // континентальные союзы IJF (lib/continents.ts называет их этими ключами)
  continents: { africa: "Африка", asia: "Азия", europe: "Европа", panAmerica: "Панамерика", oceania: "Океания" },
  ratedAthletes: forms({ one: "{n} спортсмен с рейтингом", few: "{n} спортсмена с рейтингом", many: "{n} спортсменов с рейтингом", other: "{n} спортсмена с рейтингом" }),
  // медали со строчной буквы: подсказки медальных колонок
  medal: { gold: "золото", silver: "серебро", bronze: "бронза" },
  // «−73 кг»: пункт веса
  kg: "{label} кг",
  header: {
    rank: "Место",
    rankMixed: "Рейтинг сборных, общий",
    rankMen: "Рейтинг сборных, мужчины",
    rankWomen: "Рейтинг сборных, женщины",
    leadersAvg: "Средний рейтинг лидеров",
    change: "Период",
    rating: "Рейтинг",
    days90: "90 дней",
    months6: "6 мес.",
    top1: "Топ-1",
    top8: "Средн. топ-8",
    nationsRanking: "Рейтинг сборных",
  },
  chart: {
    title: "Средний рейтинг лидеров",
    ranges: { "1Y": "1г", "4Y": "4г", All: "Всё" },
    today: "Сегодня",
    // описание рисунка
    label: "Средний рейтинг лидеров, с {from} по {to}: с {before} до {after}",
    peakTable: "Таблица сборных той недели",
    peakIn: "Пик в {month}: показать всю историю",
    peak: "Пик {n}",
    showTournaments: "Показать турниры",
  },
  leaders: {
    men: "Лидеры, мужчины",
    women: "Лидеры, женщины",
    weightPicker: "{title}: вес",
    allWeights: "Все веса",
    allAthletes: "Все спортсмены",
    weight: "Вес",
    athlete: "Спортсмен",
    rank: "Место",
    worldRank: "Место в мире в своём весе",
    rating: "Рейтинг",
  },
  tournaments: {
    title: "Турниры",
    search: "Поиск турнира",
    allYears: "Все годы",
    allLevels: "Все уровни",
    sortDateDesc: "Сортировка: дата ↓",
    sortDateAsc: "Сортировка: дата ↑",
    sortMedals: "Сортировка: медали ↓",
    tournament: "Турнир",
    date: "Дата",
    total: "Всего",
    noMatches: "По этим фильтрам турниров нет.",
  },
} satisfies typeof en.country;
