# ajr-web

The site of Another Judo Rating: Next.js 16 (App Router, Cache Components) with
Tailwind 4, on a Render web service behind Cloudflare.

There is no backend server of our own: pages read the `api` schema of the Supabase
database through its Data API with the publishable key (`src/lib/api.ts`), through one
data client that limits, queues and, when the database fails, stops the calls
(`src/lib/data-client.ts`). Every read is cached until the backend's update job says
the data changed (`/api/revalidate`, tag `data`; the `data` profile in
`next.config.ts`). Past weeks' tables are files in Cloudflare R2 (`src/lib/tables.ts`).

## Run

```bash
npm install
cp .env.example .env.local   # Supabase URL and publishable key (public values)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

## Layout

```
src/app/                pages; layout.tsx holds the header and footer of every page;
                        api/health (the data client's state), api/revalidate
src/components/         one folder per kind of page (rankings, athlete, tournament, …)
src/lib/api.ts          the backend's api functions, cached
src/lib/data-client.ts  the one way to the database: limit, queue, breaker
src/lib/tables.ts       past weeks' tables from R2, the database as fallback
src/lib/weights.ts      the 14 weight categories and their URL slugs (men-73, women-plus-78)
src/proxy.ts            tells crawlers to come back later while the database struggles
scripts/                siteload.mjs, stress.mjs (load tests), memcheck.mjs (server memory)
```

Colors and fonts are Tailwind tokens in `src/app/globals.css` (`bg-paper`, `text-claret`,
`font-serif`…), taken from the Stitch design system.
