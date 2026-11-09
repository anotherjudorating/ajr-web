output "site_url" {
  value = "https://www.${var.domain}"
}

output "render_service" {
  value = {
    id  = render_web_service.web.id
    url = render_web_service.web.url # https://ajr-web.onrender.com
  }
}

output "render_domains" {
  description = "Every active custom domain of the service, the auto-made apex redirect included"
  value       = [for d in render_web_service.web.active_custom_domains : "${d.name}${d.redirect_for_name != "" ? " → ${d.redirect_for_name}" : ""}"]
}
