# Terraform: хостинг сайта Another Judo Rating

Один root module, одно окружение (production), локальный state. Ничего не
применено: первый `plan` с import-блоками — проверка, `apply` делает владелец
руками. Бэкенд (Supabase, Worker-cron, репо `ajr-backend`) — в
`ajr-backend/infra/`; общий план и история решений —
`ajr-backend/docs/audits/2026-11-06-terraform-plan.md`.

## Что здесь управляется

| Система | Ресурсы | Файл |
|---|---|---|
| Render, команда `anotherjudorating` | проект `ajr-web` (environment Production), web service `ajr-web` (`srv-dbnfcae7bikc73cdfkmg`): Frankfurt, план Starter (`0.5c-512mb`), ветка `main`, `npm install && npm run build` / `npm run start`, env `PORT`, `SUPABASE_URL`, `SUPABASE_KEY`, `REVALIDATE_SECRET`, домен `www.anotherjudorating.com` (apex → www редирект Render делает сам) | `render.tf` |
| Cloudflare, зона `anotherjudorating.com` | DNS: apex, www (proxied → Render), 2×TXT (Google, Yandex); zone settings: SSL Full (strict), Always Use HTTPS, TLS ≥ 1.2, Rocket Loader и Email Obfuscation off; **Web Analytics** (новый, вместо Vercel Analytics, `auto_install`); **cache rule**: `/api/search-index`, `/sitemap.xml`, `/llms.txt` — час на edge (новый) | `cloudflare.tf` |
| GitHub, репо `ajr-web` | настройки репо (homepage → сайт вместо старого `*.vercel.app`), **ruleset на `main`** (новый: required check `check`), Dependabot security updates, allowed actions, secret scanning | `github.tf` |

**Вне Terraform:** сборка и деплой (git push в `main` → Render), `next.config.ts`,
Crawler Hints и managed robots.txt у Cloudflare (нет ресурса / зависит от плана),
кэш страниц (внутри Next + `/api/revalidate`). **Vercel** не моделируется: проект на
паузе и удаляется ~2026-11-14; после удаления `vercel.json` в репо можно убрать
(Render его не читает). Render API key — без скоупов (полный доступ к команде):
держать только в `~/.config/ajr/render.env`.

## Токены и права (минимум)

| Переменная | Где взять | Права |
|---|---|---|
| `TF_VAR_render_api_key` | `~/.config/ajr/render.env` (уже есть) | скоупов нет |
| `TF_VAR_cloudflare_api_token` | My Profile → API Tokens → Create Custom Token | **Zone › DNS › Edit**, **Zone › Zone Settings › Edit**, **Zone › Cache Rules › Edit**, **Zone › Zone › Read**, **Account › Account Settings › Edit** (Web Analytics: так в документации провайдера; при 403 добавить Account › Account Analytics › Read); Zone Resources: Specific zone `anotherjudorating.com`. Если один токен на оба корня — плюс **Account › Workers Scripts › Edit** |
| `TF_VAR_cloudflare_account_id`, `TF_VAR_cloudflare_zone_id` | Dashboard → зона → Overview → API | не секреты |
| `TF_VAR_github_token` | fine-grained PAT, owner `anotherjudorating`, репо `ajr-web` (+ `ajr-backend`, если общий) | **Administration: RW**, **Secrets: RW**, **Variables: RW**, **Contents: R**; срок ≤ 1 год |
| `TF_VAR_supabase_publishable_key` | Supabase → Project Settings → API Keys → `sb_publishable_…` (то, что сейчас в `SUPABASE_KEY` на Render) | — |
| `TF_VAR_revalidate_secret` | `~/.config/ajr/revalidate.env` | — |

Секреты — только через `TF_VAR_*` из `~/.config/ajr/terraform.env` (шаблон в
`ajr-backend/infra/README.md`, один файл на оба корня) или git-ignored
`terraform.tfvars`. Render возвращает значения env через API, поэтому неверное
значение переменной видно в плане как `update` — не молча.

**State** — локальный, вне репозитория, в git не попадает (`*.tfstate*`); в нём
значения env Render’а и `REVALIDATE_SECRET`. Обоснование и переезд — в README
бэкенда. Бэкап перед apply:
`terraform state pull > ~/.config/ajr/tfstate/backup/ajr-web-$(date +%F).json`.

## Перед первым планом: Cloudflare

Токена Cloudflare пока нет; без него не известны тип/содержимое и id DNS-записей.
После выпуска токена:

```sh
curl -s -H "Authorization: Bearer $TF_VAR_cloudflare_api_token" \
  "https://api.cloudflare.com/client/v4/zones/$TF_VAR_cloudflare_zone_id/dns_records?per_page=100" \
  | jq -r '.result[] | [.id,.type,.name,.content,.proxied] | @tsv'
```

Вписать `type`/`content` для `www` и apex в `cloudflare.tf` (пометки `FILL IN`) и
четыре `<record_id>` в `imports.tf`. Если в дашборде уже есть cache rules или сайт
Web Analytics — импортировать их (id в комментариях `cloudflare.tf`), а не создавать.

## Первый запуск

```sh
set -a; . ~/.config/ajr/terraform.env; set +a
cd ~/Projects/anotherjudorating/ajr-web/infra
terraform init -backend-config="path=$HOME/.config/ajr/tfstate/ajr-web.tfstate"
terraform plan -out=import.plan             # только чтение
```

Ожидаемый план:

- Render (проверено 2026-11-07 настоящим ключом, read-only): **`2 to import`,
  `0 to change`** — проект и сервис, включая значения env.
- GitHub: `3 to import`; `github_repository.web`: `homepage_url` → сайт (намеренно),
  возможные расхождения merge-настроек/secret scanning — принять или скопировать в
  код. **`1 to add`**: ruleset `main`.
- Cloudflare: `9 to import` (4 записи + 5 настроек зоны); у настроек возможны
  `update` до желаемых значений (Full (strict), Rocket Loader off…) — это и есть
  цель, но прочитать глазами. **`2 to add`**: Web Analytics, cache ruleset.
- Итого destroy/replace: **0**. Если план предлагает заменить DNS-запись — тип или
  имя в коде не те, что в зоне; исправить, не применять (секунды без сайта).

Применять по провайдерам (откат локальный):

```sh
terraform apply -target=render_project.web -target=render_web_service.web
terraform apply -target=github_repository.web -target=github_repository_ruleset.main \
  -target=github_repository_dependabot_security_updates.web -target=github_actions_repository_permissions.web
terraform apply                              # Cloudflare: DNS, настройки, Web Analytics, cache rule
```

## Проверка после apply

- `curl -sI https://www.anotherjudorating.com/` → `x-render-origin-server: Render`,
  `server: cloudflare`; `curl -sI https://anotherjudorating.com/` → 301 на www.
- Render → ajr-web → Environment: четыре переменные, значения прежние; деплой не
  запустился (ничего не менялось) или прошёл.
- `curl -fsS -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" https://www.anotherjudorating.com/api/revalidate`
  → `{"revalidated":"data"}`.
- Второй `curl -sI https://www.anotherjudorating.com/sitemap.xml` → `cf-cache-status: HIT`.
- Cloudflare → Analytics & Logs → Web Analytics: сайт есть, через час — визиты.
- GitHub → Settings → Rules: ruleset `main`; следующий PR требует `check`.

## Откат

- Render/GitHub: `terraform state rm <адрес>` — ничего не удаляется. Env Render’а и
  домены — в дашборде, значения известны.
- DNS: записи в дашборде (значения — в `cloudflare.tf`); `state rm`.
- Cache rule / Web Analytics: `terraform destroy -target=cloudflare_ruleset.cache`
  (или `…web_analytics_site.site`) — трогает только их.
