#!/bin/sh
aws cloudformation delete-stack --stack-name urlshorter-test
aws cloudformation delete-stack --stack-name urlshorter-live-stack
aws cloudformation delete-stack --stack-name aws-sam-cli-managed-default
aws s3 rb s3://aws-sam-cli-managed-default-samclisourcebucket-hfecv3sejgsr --force
aws s3 rb s3://urlshorterweb --force
aws s3 rb s3://urlshorter-live-pipeling-artifact-store --force