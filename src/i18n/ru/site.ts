// Рамка каждой страницы: шапка, подвал, поиск, переключатель языка, страницы ошибок.

import type { en } from "@/i18n/en";

export const site = {
  name: "Another Judo Rating",
  header: {
    rankings: "Рейтинги",
    explore: "Каталог",
    headToHead: "Очные встречи",
    records: "Рекорды",
    search: "Поиск",
    closeSearch: "Закрыть поиск",
    searchAthletes: "Поиск спортсменов и турниров",
  },
  search: {
    athletes: "Спортсмены",
    tournaments: "Турниры",
    nations: "Страны",
    placeholder: "Спортсмены, турниры, страны",
    noMatches: "Быстрых совпадений нет.",
    inExplore: "Искать в каталоге",
  },
  footer: {
    methodology: "Методология",
    exportData: "Экспорт данных",
    contact: "Контакты",
    updated: "Рейтинги обновлены {date}",
    source: "Источник:",
    judobase: "IJF Judobase",
    github: "GitHub",
    namesNote: "Имена спортсменов и названия турниров: как в IJF Judobase",
  },
  language: {
    label: "Язык",
  },
  errors: {
    notFoundTitle: "Матэ. Соре-мадэ.",
    notFoundLead: "Возможно, ссылка битая.",
    errorTitle: "Матэ.",
    errorLead: "Страница не загрузилась. Обычно через минуту всё работает.",
    siteErrorLead: "Сайт не загрузился. Обычно через минуту всё работает.",
    tryAgain: "Попробовать ещё раз",
    searchPlaceholder: "Поиск спортсменов и турниров",
    searchTip: "Попробуйте только фамилию, например «Tasoev».",
    soon: "Скоро",
    onItsWay: "Раздел «{section}» в работе.",
    notBuilt: "Эта часть сайта ещё не готова. Рейтинги уже работают.",
  },
  breadcrumbs: {
    label: "Навигация",
    home: "Главная",
  },
  rowLink: {
    open: "Открыть",
  },
} satisfies typeof en.site;
