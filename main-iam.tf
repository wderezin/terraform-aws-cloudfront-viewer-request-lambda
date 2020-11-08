data aws_region current {
}

data aws_iam_policy_document assume_role_policy {
  version = "2012-10-17"
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
      type        = "Service"
    }
  }
}

data aws_iam_policy_document role_policy {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = [
    "arn:aws:logs:*:*:*"]
  }
}

resource aws_iam_role lambda {
  name               = "${local.lambda_name}-${data.aws_region.current.name}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
  tags               = local.tags
}

resource aws_iam_role_policy cloudwatch {
  name   = "cloudwatch"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.role_policy.json
}