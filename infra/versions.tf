# Another Judo Rating, site hosting: the Render web service (env, domains), the
# Cloudflare zone in front of it (DNS, zone settings, Web Analytics, cache rules) and
# the ajr-web repository on GitHub. One root module, one environment (production).
# The backend (Supabase, the Worker cron, ajr-backend) is in ajr-backend/infra.

terraform {
  required_version = "~> 1.14"

  required_providers {
    render     = { source = "render-oss/render", version = "~> 1.9" }      # 1.9.1 (2026-07-22), official
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 5.28" } # 5.28.1 (2026-10-20); v4 is in maintenance
    github     = { source = "integrations/github", version = "~> 6.13" }   # 6.13.0 (2026-07-08)
  }

  # Local state, git-ignored, kept outside the repository (it holds the Render env
  # values and the REVALIDATE_SECRET): see ajr-backend/infra/versions.tf for the
  # reasoning and README for the init line and the backup step.
  backend "local" {}
}
