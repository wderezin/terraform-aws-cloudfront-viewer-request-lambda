
variable lambda_name {
  type        = string
  default     = "cloudfront_index_rewrite"
  description = "Name of lambda"
}

variable apex_domain_redirect {
  type        = bool
  default     = false
  description = "Redirect an apex request to www (daringway.com -> www.daringway.com)"
}

variable index_rewrite {
  type        = bool
  default     = false
  description = "Rewrite a directory request to /index.html"
}

variable ghost_hostname {
  type = string
  default = ""
  description = "Hostname of the ghost CMS server"
}
