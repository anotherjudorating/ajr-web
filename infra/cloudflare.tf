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
          http.request.uri.path wildcard "/archive/*/*"
        )))
    EOT
  }]
}

# Free plan: one rule, 10 s periods. The site itself reads data.<domain> from Render's
# few outbound IPs: they are left out once it does (render_outbound_ips).
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
    expression = (
      length(var.render_outbound_ips) == 0
      ? "(http.host eq \"data.${var.domain}\")"
      : "(http.host eq \"data.${var.domain}\" and not ip.src in {${join(" ", var.render_outbound_ips)}})"
    )
    ratelimit = {
      characteristics     = ["cf.colo.id", "ip.src"]
      period              = 10
      requests_per_period = 60
      mitigation_timeout  = 10
    }
  }]
}
