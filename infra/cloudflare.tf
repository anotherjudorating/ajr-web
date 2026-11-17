# Cloudflare: the zone in front of Render. DNS records, the zone settings that can
# break a Next.js site, Web Analytics (replaces Vercel Analytics, removed from the
# code), a cache rule for the three big bot-facing responses.
#
# The zone itself is a data source, not a resource: there is nothing to configure on
# it and a resource would let `terraform destroy` delete the zone.

data "cloudflare_zone" "site" {
  zone_id = var.cloudflare_zone_id
}

# ---- DNS ----------------------------------------------------------------------
# Public DNS on 2026-11-07: apex and www answer with Cloudflare's proxy addresses
# (104.21.35.205, 172.67.179.144 + AAAA), i.e. proxied records pointing at Render
# (x-render-origin-server on the responses). What Render asks for: www → CNAME
# ajr-web.onrender.com; apex → A 216.24.57.1 (or a CNAME, flattened by Cloudflare).
# The real type/content/ids are only visible with a token: before the import, run
#   curl -s -H "Authorization: Bearer $TF_VAR_cloudflare_api_token" \
#     "https://api.cloudflare.com/client/v4/zones/$TF_VAR_cloudflare_zone_id/dns_records?per_page=100" \
#     | jq -r '.result[] | [.id,.type,.name,.content,.proxied] | @tsv'
# and copy type + content here and the ids into imports.tf. A wrong type or name
# would plan delete + create: seconds without the site. Never apply such a plan.

resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = "ajr-web.onrender.com"
  proxied = true
  ttl     = 1 # automatic (required with proxied = true)
}

resource "cloudflare_dns_record" "apex" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "CNAME" # flattened at the apex by Cloudflare
  content = "ajr-web.onrender.com"
  proxied = true
  ttl     = 1
}

# Verification records: values are not secrets (anyone can dig them).
resource "cloudflare_dns_record" "google_verification" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "TXT"
  content = "\"google-site-verification=Sxy6FaQhOYOfMY4O1-7--U4Iaw9n--NZx5pQvdyVcpo\""
  ttl     = 3600
}

resource "cloudflare_dns_record" "yandex_verification" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "TXT"
  content = "\"yandex-verification: a1673926f4c55bb0\""
  ttl     = 1
}

# ---- Zone settings --------------------------------------------------------------
# Only the settings worth pinning; the rest of the zone stays as it is. Values are
# the wanted ones (Render behind Cloudflare: Full (strict), Render has its own
# certificate; SEO audit 11-04: Rocket Loader and email obfuscation off, they
# rewrite Next's HTML). The import shows the real values: a difference is either a
# wanted change (apply it) or a value to copy here first.
locals {
  zone_settings = {
    ssl               = "strict" # Full (strict)
    always_use_https  = "on"
    min_tls_version   = "1.2"
    rocket_loader     = "off"
    email_obfuscation = "off"
  }
}

resource "cloudflare_zone_setting" "site" {
  for_each   = local.zone_settings
  zone_id    = data.cloudflare_zone.site.zone_id
  setting_id = each.key
  value      = each.value
}

# ---- Web Analytics ----------------------------------------------------------------
# Not managed here (yet): the site exists since 2026-10-28, made in the dashboard
# (site tag 465c04a73bea46fa82f1b205aab34b3d, automatic setup), and the API answers
# "Authentication error" to /accounts/{id}/rum/site_info even with Account Settings
# Write + Account Analytics Read (2026-11-07). When it answers, import it:
#   import { to = cloudflare_web_analytics_site.site
#            id = "<account_id>/465c04a73bea46fa82f1b205aab34b3d" }
# with account_id, zone_tag = the zone, auto_install = true. Never create one: the
# dashboard already has it (a second was made by mistake on 2026-11-07 and deleted).

# ---- Cache rule -----------------------------------------------------------------
# New (not imported). Hosting audit 11-07, §5/§10.2: the only safe win from the
# proxy is to cache the three responses bots fetch again and again
# (/api/search-index 1.4 MB, /sitemap.xml 1.8 MB, /llms.txt) for an hour at the
# edge; HTML stays uncached (Next's own cache + /api/revalidate). One ruleset per
# phase per zone: if cache rules were ever made in the dashboard, import that
# ruleset (`zones/<zone_id>/<ruleset_id>`, GET /zones/{zone_id}/rulesets) instead
# of letting Terraform create a second one, which the API refuses.
resource "cloudflare_ruleset" "cache" {
  zone_id     = data.cloudflare_zone.site.zone_id
  name        = "default"
  description = "Cache rules"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules = [
    # The pages' HTML, 3 hours at the edge: every request for a page was a render on
    # Render (2026-11-10: 29 thousand HTML requests a day, 1% from the cache; the home
    # page alone 650; 2026-11-17: a scraper reading every page 2 or 3 times within the
    # hour, 10 minutes caught none of it). The update job purges www after a publish
    # that changed the site (ajr-backend .github/refresh-site.sh), after telling the
    # site, whose data then expires (expire: 0, not stale-while-revalidate): the next
    # visit renders the new data and the edge keeps that. Only the plain page: not Next's navigation and
    # prefetch data (the same address with an RSC header and a ?_rsc= query), not a
    # filtered or paired URL (a query), not the API. The edge TTL override caches the
    # streamed pages too (an athlete, a nation: private, no-store from the origin; seen
    # HIT on 2026-11-11); the browsers still follow the origin. origin_cache_control is
    # left alone: the free plan cannot set it ("not entitled").
    # Header names: lower case over HTTP/2 and 3, as sent over HTTP/1.1.
    {
      description = "www: a page's HTML, 3 hours at the edge (purged after a publish)"
      expression  = <<-EOT
        (http.host eq "www.${var.domain}" and http.request.method eq "GET"
          and http.request.uri.query eq ""
          and not starts_with(http.request.uri.path, "/api/")
          and not starts_with(http.request.uri.path, "/_next/")
          and not any(http.request.headers.names[*] == "rsc")
          and not any(http.request.headers.names[*] == "RSC")
          and not any(http.request.headers.names[*] == "next-router-prefetch")
          and not any(http.request.headers.names[*] == "Next-Router-Prefetch"))
      EOT
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache = true
        edge_ttl = {
          mode            = "override_origin"
          default         = local.html_edge_ttl
          status_code_ttl = [{ status_code = 404, value = 60 }]
        }
        browser_ttl = { mode = "respect_origin" }
      }
    },
    # A head-to-head pair (/head-to-head?a=…&b=…&w=…): the same, keyed by the whole
    # query string (a custom key of only a, b and w is not on the free plan; a pair's
    # two orders are two pages anyway: the first athlete stands on the left). 27% of the scraper's requests on 2026-11-17,
    # each two athletes' whole histories from the database, and none cached (a query).
    # The views are counted by the browser (POST /api/matchup-view), not by the render.
    {
      description = "www: a head-to-head pair's HTML, 3 hours at the edge"
      expression  = <<-EOT
        (http.host eq "www.${var.domain}" and http.request.method eq "GET"
          and http.request.uri.path eq "/head-to-head" and http.request.uri.query ne ""
          and not any(http.request.headers.names[*] == "rsc")
          and not any(http.request.headers.names[*] == "RSC")
          and not any(http.request.headers.names[*] == "next-router-prefetch")
          and not any(http.request.headers.names[*] == "Next-Router-Prefetch"))
      EOT
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache = true
        edge_ttl = {
          mode            = "override_origin"
          default         = local.html_edge_ttl
          status_code_ttl = [{ status_code = 404, value = 60 }]
        }
        browser_ttl = { mode = "respect_origin" }
      }
    },
    {
      description = "Cache the search index, the sitemap and llms.txt for an hour"
      expression  = "(http.request.uri.path in {\"/api/search-index\" \"/sitemap.xml\" \"/llms.txt\"})"
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache = true
        edge_ttl = {
          mode    = "override_origin"
          default = 3600
        }
      }
    },
    # data.<domain> (R2, ajr-backend/infra/r2.tf): versioned files never change, a year
    # at the edge and in browsers; the query string is never part of the key (the WAF
    # rule below blocks it anyway).
    {
      description = "data.: versioned files are immutable, a year at the edge"
      expression  = "(http.host eq \"data.${var.domain}\" and starts_with(http.request.uri.path, \"/v/\"))"
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache = true
        edge_ttl = {
          mode            = "override_origin"
          default         = 31536000
          status_code_ttl = [{ status_code = 404, value = 60 }] # a file not there yet: a minute
        }
        browser_ttl = { mode = "override_origin", default = 31536000 }
        cache_key   = { custom_key = { query_string = { exclude = { all = true } } } }
      }
    },
    # An athlete's places every week (ajr-backend ajr/tables): they change every week,
    # an hour at the edge and in browsers.
    {
      description = "data.: an athlete's places, an hour at the edge"
      expression  = "(http.host eq \"data.${var.domain}\" and starts_with(http.request.uri.path, \"/places/\"))"
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache = true
        edge_ttl = {
          mode            = "override_origin"
          default         = 3600
          status_code_ttl = [{ status_code = 404, value = 60 }]
        }
        browser_ttl = { mode = "override_origin", default = 3600 }
        cache_key   = { custom_key = { query_string = { exclude = { all = true } } } }
      }
    },
    # The manifest is never cached at the edge: it is tiny, the site keeps it a few
    # minutes itself, and a 404 cached before it existed was served for hours (11-08).
    {
      description       = "data.: the manifest is not cached at the edge"
      expression        = "(http.host eq \"data.${var.domain}\" and http.request.uri.path eq \"/manifest.json\")"
      action            = "set_cache_settings"
      enabled           = true
      action_parameters = { cache = false }
    },
    {
      description = "data.: the archive follows its own Cache-Control"
      expression  = "(http.host eq \"data.${var.domain}\" and starts_with(http.request.uri.path, \"/archive/\"))"
      action      = "set_cache_settings"
      enabled     = true
      action_parameters = {
        cache     = true
        edge_ttl  = { mode = "respect_origin", status_code_ttl = [{ status_code = 404, value = 60 }] }
        cache_key = { custom_key = { query_string = { exclude = { all = true } } } }
      }
    },
  ]
}

# ---- data.<domain>: only reads of known paths, and not too many --------------------
# Every request that misses the edge cache is a billed R2 read: block what is not a
# GET/HEAD of a known path without a query string (random paths and query strings
# would miss the cache every time), and limit each IP. The Worker's kill switch is the
# last line (ajr-backend/cloudflare). docs/audits/2026-11-08-r2-tables-plan.md §5.

resource "cloudflare_ruleset" "waf_custom" {
  zone_id     = data.cloudflare_zone.site.zone_id
  name        = "default"
  description = "Custom WAF rules"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  rules = [{
    description = "data.: only GET/HEAD of known paths, no query string"
    action      = "block"
    enabled     = true
    expression  = <<-EOT
      (http.host eq "data.${var.domain}" and not (
        http.request.method in {"GET" "HEAD"} and http.request.uri.query eq "" and (
          http.request.uri.path eq "/manifest.json" or
          http.request.uri.path wildcard "/v/*/rankings/*/*/*.json" or
          http.request.uri.path wildcard "/v/*/p4p/*/*/*.json" or
          http.request.uri.path wildcard "/v/*/teams/*/*/*.json" or
          http.request.uri.path wildcard "/places/*/*.json" or
          http.request.uri.path wildcard "/archive/*/*"
        )))
    EOT
    }, {
    # Mid-November 2026: a scraper read every page from tens of thousands of IPs a day
    # (residential proxies), fetching the HTML only, never a script: no browser. Its
    # first user agents were out-of-date Chrome; challenged, it switched within hours to
    # a current Chrome on a Mac, the same as people's. So every request for a page is
    # challenged, whatever it says it is: a browser passes (in a second or two, a tick
    # at most, once a day: challenge_ttl), a script does not. Verified bots pass
    # (cf.client.bot: Google, Bing, Yandex...). Left out: /api/ (the update job's
    # revalidation, the search index), /_next/ (scripts and styles, fetched by a
    # browser that already passed), the files crawlers read, and data.<domain> (the
    # site's own server reads it as "node"). Bot Fight Mode would challenge those too,
    # with no exceptions on the free plan.
    description = "www: a managed challenge for every page (scrapers)"
    action      = "managed_challenge"
    enabled     = true
    expression  = <<-EOT
      (http.host in {"www.${var.domain}" "${var.domain}"} and not cf.client.bot
        and not starts_with(http.request.uri.path, "/api/")
        and not starts_with(http.request.uri.path, "/_next/")
        and not http.request.uri.path in {"/robots.txt" "/sitemap.xml" "/llms.txt" "/icon.svg" "/favicon.ico"})
    EOT
  }]
}

# How long a passed challenge lasts: a day (Cloudflare's default is 30 minutes), so a
# person sees it at most once a day.
resource "cloudflare_zone_setting" "challenge_ttl" {
  zone_id    = data.cloudflare_zone.site.zone_id
  setting_id = "challenge_ttl"
  value      = 86400
}

# Free plan: one rule, 10 s periods. The site itself reads data.<domain> from Render's
# few outbound IPs: they are left out once it does (render_outbound_ips). The site's
# pages are limited per IP in the site's code (src/proxy.ts): a free rule may not look
# at headers or the query, so it cannot tell a page from Next's prefetches of the links
# on it (?_rsc=), of which a person scrolling a table makes dozens.
resource "cloudflare_ruleset" "ratelimit" {
  zone_id     = data.cloudflare_zone.site.zone_id
  name        = "default"
  description = "Rate limits"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules = [{
    description = "data.: 60 requests per 10 s per IP"
    action      = "block"
    enabled     = true
    expression  = local.ratelimit_data
    ratelimit = {
      characteristics     = ["cf.colo.id", "ip.src"]
      period              = 10
      requests_per_period = 60
      mitigation_timeout  = 10
    }
  }]
}

locals {
  html_edge_ttl = 10800 # 3 hours
  ratelimit_data = (
    length(var.render_outbound_ips) == 0
    ? "(http.host eq \"data.${var.domain}\")"
    : "(http.host eq \"data.${var.domain}\" and not ip.src in {${join(" ", var.render_outbound_ips)}})"
  )
}
