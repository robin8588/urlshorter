#!/bin/sh
aws s3 cp swagger.yaml s3://aws-sam-cli-managed-default-samclisourcebucket-hfecv3sejgsr/swagger.yaml
sam deploy