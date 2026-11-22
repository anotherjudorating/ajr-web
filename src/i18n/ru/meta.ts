// Заголовки и описания для поисковиков (generateMetadata), по страницам.

import type { en } from "@/i18n/en";

export const meta = {
  site: "Независимый рейтинг дзюдо по Glicko-2: сильнейшие в каждом весе по всем схваткам IJF.",
  home: {
    title: "Альтернативный мировой рейтинг дзюдо",
    description:
      "Открытый рейтинг дзюдо на статистике: Glicko-2 по всем схваткам World Tour с 2009 года, лидеры каждого веса, главные взлёты и сенсации.",
  },
} satisfies typeof en.meta;
