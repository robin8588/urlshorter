#!/bin/sh
aws s3 cp index.html s3://shoturlweb/index.html
aws s3 cp 404.html s3://shoturlweb/404.html
aws s3 cp sync swaggerui/ s3://shoturlweb/swaggerui/
sam deploy