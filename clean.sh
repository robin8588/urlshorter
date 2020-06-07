#!/bin/sh
aws cloudformation delete-stack --stack-name urlshoter
aws s3 rb s3://aws-sam-cli-managed-default-samclisourcebucket-hfecv3sejgsr --force
aws s3 rb s3://shoturlweb --force