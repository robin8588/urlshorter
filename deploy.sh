#!/bin/sh
aws s3 sync web/ s3://shoturlweb/
sam deploy