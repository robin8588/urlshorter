#!/bin/sh
aws cloudformation delete-stack --stack-name urlshoter-test
aws cloudformation delete-stack --stack-name shot-url-live-stack
aws cloudformation delete-stack --stack-name aws-sam-cli-managed-default
aws s3 rb s3://aws-sam-cli-managed-default-samclisourcebucket-hfecv3sejgsr --force
aws s3 rb s3://shoturlweb --force
aws s3 rb s3://shot-ur-livel-pipeling-artifact-store --force