# ajr-web

The site of Another Judo Rating: Next.js 16 (App Router, Cache Components) with
Tailwind 4, deployed on Vercel.

There is no backend server of our own: pages read the `api` schema of the Supabase
database through its Data API with the publishable key (`src/lib/api.ts`). The data
changes every 15 minutes (the backend job), so every read is cached for 15 minutes
(the `data` profile in `next.config.ts`) and pages are rendered ahead of time.

## Run

```bash
npm install
cp .env.example .env.local   # Supabase URL and publishable key (public values)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Layout

```
src/app/            pages; layout.tsx holds the header and footer of every page
src/components/     Header, Footer, WeightSwitcher, RankingTable, Change (▲▼, +/−)
src/lib/api.ts      the backend's api functions: leaderboard, athlete, athlete_history, last_update
src/lib/weights.ts  the 14 weight categories and their URL slugs (men-73, women-plus-78)
prototype/          the clickable HTML prototype from Google Stitch: the reference for the design
```

Colors and fonts are Tailwind tokens in `src/app/globals.css` (`bg-paper`, `text-claret`,
`font-serif`…), taken from the Stitch design system.
