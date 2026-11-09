# Identifiers (not secrets; the defaults are production's, read on 2026-11-07).

variable "github_owner" {
  type    = string
  default = "anotherjudorating" # org id 348801882
}

variable "github_repository" {
  type    = string
  default = "ajr-web" # repo id 1435679328
}

variable "render_owner_id" {
  description = "The Render team (dashboard.render.com → team settings; GET /v1/owners)"
  type        = string
  default     = "tea-dbnf8e3m8hqs73c24ldg" # team "anotherjudorating"
}

variable "cloudflare_account_id" {
  description = "Dashboard → any zone → Overview → API (right column) → Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Same place → Zone ID of anotherjudorating.com"
  type        = string
}

variable "domain" {
  type    = string
  default = "anotherjudorating.com"
}

variable "supabase_project_ref" {
  type    = string
  default = "vrnpqahtpjrlmlrkzbja"
}

# Provider tokens: TF_VAR_<name> exported from ~/.config/ajr/terraform.env (README),
# or terraform.tfvars (git-ignored). Minimal permissions in the README.

variable "render_api_key" {
  description = "dashboard.render.com → Account Settings → API Keys (~/.config/ajr/render.env). Render keys have no scopes: full access to the team."
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Zone › DNS › Edit, Zone › Zone Settings › Edit, Zone › Cache Rules › Edit, Zone › Zone › Read, Account › Account Settings › Edit (Web Analytics); zone resources: anotherjudorating.com"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "Fine-grained PAT, owner anotherjudorating, repo ajr-web (+ ajr-backend if shared with ajr-backend/infra): Administration RW, Secrets RW, Variables RW, Contents R, Metadata R"
  type        = string
  sensitive   = true
}

# Values Terraform writes into Render (secrets of the application).

variable "supabase_publishable_key" {
  description = "sb_publishable_… (Supabase → Project Settings → API Keys), the site's SUPABASE_KEY. Public by design (anon role, api schema only) but kept out of git."
  type        = string
  sensitive   = true
}

variable "revalidate_secret" {
  description = "The site's REVALIDATE_SECRET (~/.config/ajr/revalidate.env); the same value is the Actions secret of ajr-backend (ajr-backend/infra)"
  type        = string
  sensitive   = true
}

variable "render_outbound_ips" {
  description = "Render's outbound IPs (service → Connect → Outbound), left out of the data. rate limit once the site reads it"
  type        = list(string)
  default     = []
}

variable "owner_email" {
  description = "The owner's mailbox that data@ forwards to (email.tf). Kept out of git."
  type        = string
  sensitive   = true
}
