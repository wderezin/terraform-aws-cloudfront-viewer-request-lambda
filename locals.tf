
locals {
  lambda_name = var.lambda_name
  tags        = var.tags

  apex_domain_redirect = tostring(var.apex_domain_redirect)
  index_rewrite        = tostring(var.index_rewrite)
}