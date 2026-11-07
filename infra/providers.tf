provider "render" {
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
  # The provider redeploys the service after a settings or env change (Render would
  # anyway). Leave wait_for_deploy_completion off: a build here is ~5 minutes.
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "github" {
  owner = var.github_owner
  token = var.github_token
}
