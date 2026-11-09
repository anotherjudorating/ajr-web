# GitHub: the ajr-web repository, a ruleset on main (new: the repository has none
# today), security settings. ajr-backend is managed from ajr-backend/infra.

resource "github_repository" "web" {
  name        = var.github_repository
  description = "Website for Another Judo Rating"
  # Found: the old Vercel URL. The first apply changes it to the site: wanted.
  homepage_url = "https://www.${var.domain}"
  visibility   = "public"

  # As found 2026-11-07.
  has_issues      = true
  has_wiki        = true
  has_projects    = true
  has_discussions = false

  # Merge settings are not readable without Administration: read; the first plan
  # after import shows them. Copy them here to pin them.
  # allow_merge_commit     = true
  # allow_squash_merge     = true
  # allow_rebase_merge     = true
  # delete_branch_on_merge = true

  security_and_analysis {
    secret_scanning {
      status = "enabled"
    }
    secret_scanning_push_protection {
      status = "enabled"
    }
  }

  archive_on_destroy = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "github_repository_dependabot_security_updates" "web" {
  repository = github_repository.web.name
  enabled    = true
}

# Created by the first apply (the backend's ruleset is the model). Required check:
# the "check" job of check.yml (lint + tsc on every pull request).
resource "github_repository_ruleset" "main" {
  name        = "main"
  repository  = github_repository.web.name
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["~DEFAULT_BRANCH"]
      exclude = []
    }
  }

  rules {
    deletion         = true
    non_fast_forward = true

    pull_request {
      required_approving_review_count   = 0
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_review_thread_resolution = false
      allowed_merge_methods             = ["merge", "squash", "rebase"]
    }

    required_status_checks {
      strict_required_status_checks_policy = false
      do_not_enforce_on_create             = false
      required_check {
        context        = "check"
        integration_id = 15368 # GitHub Actions
      }
    }
  }
}

# check.yml reads no secrets; Render deploys from its own GitHub App. "all" is
# assumed (not readable with the discovery token).
resource "github_actions_repository_permissions" "web" {
  repository      = github_repository.web.name
  enabled         = true
  allowed_actions = "all"
}
