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
  type    = "CNAME"                # FILL IN from the API
  content = "ajr-web.onrender.com" # FILL IN from the API
  proxied = true
  ttl     = 1 # automatic (required with proxied = true)
}

resource "cloudflare_dns_record" "apex" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "A"           # FILL IN from the API ("A" 216.24.57.1 or "CNAME" to the Render host)
  content = "216.24.57.1" # FILL IN from the API
  proxied = true
  ttl     = 1
}

# Verification records: values are not secrets (anyone can dig them).
resource "cloudflare_dns_record" "google_verification" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = var.domain
  type    = "TXT"
  content = "\"google-site-verification=Sxy6FaQhOYOfMY4O1-7--U4Iaw9n--NZx5pQvdyVcpo\""
  ttl     = 1
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

# ---- Web Analytics --------------------------------------------------------------
# New (not imported): replaces Vercel Analytics. auto_install injects the beacon on
# proxied responses, so the site's code needs nothing. The dashboard: Analytics &
# Logs → Web Analytics. If a site was already added by hand, import it instead:
# `<account_id>/<site_tag>` (GET /accounts/{account_id}/rum/site_info/list).
resource "cloudflare_web_analytics_site" "site" {
  account_id   = var.cloudflare_account_id
  zone_tag     = data.cloudflare_zone.site.zone_id
  auto_install = true
}

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
  ]
}
