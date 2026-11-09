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

  # State in R2 (bucket ajr-terraform-state, ajr-backend/infra/r2.tf), read with its own
  # R2 API token (Object Read & Write on that bucket only): AWS_ACCESS_KEY_ID and
  # AWS_SECRET_ACCESS_KEY from ~/.config/ajr/terraform.env. The endpoint is given at init
  # (-backend-config="endpoints={s3=\"https://<account id>.r2.cloudflarestorage.com\"}"),
  # as a backend cannot read variables; README has the line. use_lockfile: a lock
  # object beside the state stops two applies at once.
  backend "s3" {
    bucket                      = "ajr-terraform-state"
    key                         = "web/terraform.tfstate"
    region                      = "auto"
    use_lockfile                = true
    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}
