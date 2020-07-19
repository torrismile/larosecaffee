#!/usr/bin/env bash
aws s3 sync --delete --exclude deploy.sh . s3://larosecaffee.vikiniedobova.cz
