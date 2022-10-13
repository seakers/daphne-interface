#!/bin/sh

cd /app
npm run build:prod
cd /app/aws
python3 deploy.py
cd /app