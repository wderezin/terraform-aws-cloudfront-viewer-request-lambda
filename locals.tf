
locals {
  lambda_name = var.lambda_name
  tags        = var.tags

  apex_domain_redirect = tostring(var.apex_domain_redirect)
  index_rewrite        = tostring(var.index_rewrite)

  config_json = jsonencode({
    "apex_domain_redirect" : tostring(var.apex_domain_redirect),
    "index_rewrite" : tostring(var.index_rewrite),
    "append_slash" : tostring(var.append_slash),
    "ghost_hostname" : var.ghost_hostname
  })

}