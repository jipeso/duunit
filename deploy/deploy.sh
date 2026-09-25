#!/usr/bin/env bash
set -euo pipefail

APP_TAG="${1:?Usage: deploy.sh <tag>}"
cd "$(dirname "$0")"

if grep -q '^APP_TAG=' .env; then
  sed -i "s/^APP_TAG=.*/APP_TAG=${APP_TAG}/" .env
else
  echo "APP_TAG=${APP_TAG}" >> .env
fi

docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d