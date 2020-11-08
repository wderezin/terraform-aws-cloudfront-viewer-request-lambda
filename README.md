# Terraform AWS Cloudfront Domain Redirect

A [Daring Way](https://www/daringway.com/)  cloudfront edge lambda

    Contestant: AWS for $00, Alex.
    Alex: How you easily configure AWS Cloudfront to do standard redirect and rewrites ?
    Contestant: What is the Daring Way AWS Cloudfront Viewer Request Lambda Terraform Module.
    Alex: That is correct.
    
# Usage

```hcl
module cloudfront_lambda {
  source = "daringway/cloudfront-index_rewrite/aws"
  tags   = {}
  apex_domain_redirect = true
  index_rewrite = true
}

resource aws_cloudfront_distribution a_distribution {
 
   ...

   lambda_function_association {
      event_type   = "viewer-request"
      lambda_arn   = module.cloudfront_lambda.qualified_arn
      include_body = false
  }

  ...
}
```    
    
[Semantic Version](https://semver.org) is being applied to the modules. 

1. MAJOR version requires a change. 
    - upgrading to new version of terraform
    - variable name changes
    - new variable without a default value
    - changes that will require manually updating the terraform.tfstate file such as a `terraform state mv`
    - changes that will require resources being destroy and created that require external terraform application configuration
2. MINOR version add new functionality in a backwards compatible manner
    - new variable with default value
3. PATCH version have backwards compatible bug fixes