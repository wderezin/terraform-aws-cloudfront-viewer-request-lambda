
locals {
  lambda_name = var.lambda_name
  tags        = var.tags

  apex_domain_redirect = var.apex_domain_redirect
  index_rewrite        = var.index_rewrite
}