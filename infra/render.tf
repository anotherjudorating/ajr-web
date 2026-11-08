# Render: the project and the web service that runs the site (`next start`).
# Values are what GET /v1/services/srv-dbnfcae7bikc73cdfkmg returned on 2026-11-07,
# so the first plan after import should show no change, provided the two secret
# variables hold today's values (Render returns env values, so a wrong value shows
# as an update, not silently).

resource "render_project" "web" {
  name = "ajr-web"
  environments = {
    # The key must equal the environment's name for the import to match.
    "Production" = {
      name             = "Production"
      protected_status = "unprotected"
    }
  }
}

resource "render_web_service" "web" {
  name           = "ajr-web"
  plan           = "0.5c-512mb" # "Starter" in the dashboard; the API reports the plan by size
  region         = "frankfurt"
  environment_id = render_project.web.environments["Production"].id

  runtime_source = {
    native_runtime = {
      runtime             = "node"
      repo_url            = "https://github.com/${var.github_owner}/${var.github_repository}"
      branch              = "main"
      auto_deploy         = true
      auto_deploy_trigger = "commit"
      build_command       = "npm install && npm run build"
    }
  }
  start_command = "npm run start"

  # Render injects PORT for the start command; it is also an explicit env var on the
  # service (found), so it is listed, or the import would plan its removal.
  env_vars = {
    PORT         = { value = "10000" }
    SUPABASE_URL = { value = "https://${var.supabase_project_ref}.supabase.co" }
    SUPABASE_KEY = { value = var.supabase_publishable_key }
    # The same value feeds the ajr-backend Actions secret (ajr-backend/infra):
    # one rotation = both applies, no window where the job cannot refresh the site.
    REVALIDATE_SECRET = { value = var.revalidate_secret }
    # Past weeks' tables from R2 (ajr-web src/lib/tables.ts); removing it sends every
    # past day back to the database (the way back).
    AJR_DATA_URL = { value = "https://data.${var.domain}" }
  }

  # Only the primary domain is listed: Render adds the apex as a redirect to www by
  # itself (redirect_for_name = www), and the provider keeps auto-generated
  # redirect domains out of custom_domains (they show in active_custom_domains).
  custom_domains = [
    { name = "www.${var.domain}" },
  ]

  previews = {
    generation = "off"
  }

  # health_check_path: none today (""); set e.g. "/" once a zero-downtime deploy is
  # wanted. num_instances: left unset (1; the instance count stays outside Terraform).

  lifecycle {
    prevent_destroy = true
  }
}
