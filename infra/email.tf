# Email: the domain only receives, through Cloudflare Email Routing, which forwards to
# the owner's own mailbox. No mailbox of its own, no sending (answers go out through the
# owner's mail, "Send mail as"). data@ is the contact the dataset's page and README give
# for questions and removal requests (docs/audits/2026-11-08-data-export.md).
#
# The forward-to address must be verified before a rule can use it: after the first
# apply Cloudflare sends it a link, and the rules work once it is clicked.

# Turns routing on and adds the MX and SPF records it needs (there were none: the
# domain had no mail at all on 2026-11-09).
resource "cloudflare_email_routing_dns" "site" {
  zone_id = data.cloudflare_zone.site.zone_id
}

resource "cloudflare_email_routing_address" "owner" {
  account_id = var.cloudflare_account_id
  email      = var.owner_email
}

resource "cloudflare_email_routing_rule" "data" {
  zone_id = data.cloudflare_zone.site.zone_id
  name    = "data@ to the owner"
  enabled = true
  matchers = [{
    type  = "literal"
    field = "to"
    value = "data@${var.domain}"
  }]
  actions = [{
    type  = "forward"
    value = [cloudflare_email_routing_address.owner.email]
  }]
}
