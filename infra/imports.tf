# Import blocks (Terraform >= 1.5): `terraform plan` shows "N to import" and the
# differences; `terraform apply` records them. Nothing existing is created. Keep the
# file after the import or delete it: both work.
#
# IDs read on 2026-11-07 (Render API, GitHub API), except the Cloudflare record ids:
# no token yet (see cloudflare.tf for the curl that lists them).
#
# Not imported, created by the first apply: github_repository_ruleset.main,
# cloudflare_ruleset.cache (unless they were
# made by hand meanwhile: then import them, ids in the comments of cloudflare.tf).

# ---- Render -------------------------------------------------------------------

import {
  to = render_project.web
  id = "prj-dbnfcabm8hqs73c2f7u0"
}

import {
  to = render_web_service.web
  id = "srv-dbnfcae7bikc73cdfkmg"
}

# ---- GitHub -------------------------------------------------------------------

import {
  to = github_repository.web
  id = "ajr-web"
}

import {
  to = github_repository_dependabot_security_updates.web
  id = "ajr-web"
}

import {
  to = github_actions_repository_permissions.web
  id = "ajr-web"
}

# ---- Cloudflare (zone) --------------------------------------------------------

import {
  to = cloudflare_dns_record.www
  id = "${var.cloudflare_zone_id}/86fe9e160245c2ac1f532d24dcddf5e5"
}

import {
  to = cloudflare_dns_record.apex
  id = "${var.cloudflare_zone_id}/9da13ca16680a093c77c3135d44c67ed"
}

import {
  to = cloudflare_dns_record.google_verification
  id = "${var.cloudflare_zone_id}/65df7dddd111c0cd4060bc32ad7da208"
}

import {
  to = cloudflare_dns_record.yandex_verification
  id = "${var.cloudflare_zone_id}/c329060184db5f793b83ba6236998d7a"
}

import {
  for_each = local.zone_settings
  to       = cloudflare_zone_setting.site[each.key]
  id       = "${var.cloudflare_zone_id}/${each.key}"
}
