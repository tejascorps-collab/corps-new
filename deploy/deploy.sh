#!/usr/bin/env bash
#
# Deploy / update FDI Prime on the VPS for admin.thecorps.in
# Run this ON THE VPS over SSH. Re-run it any time to pull the latest code and rebuild.
#
#   bash deploy.sh
#
set -euo pipefail

REPO="https://github.com/tejascorps-collab/corps-new.git"
APP_DIR="/var/www/admin.thecorps.in"

echo "==> Deploying to $APP_DIR"

# 1. Clone on first run, otherwise pull latest.
if [ -d "$APP_DIR/.git" ]; then
  echo "==> Existing checkout found, pulling latest..."
  cd "$APP_DIR"
  git fetch --all
  git reset --hard origin/main
else
  echo "==> First deploy, cloning repo..."
  sudo mkdir -p "$APP_DIR"
  sudo chown -R "$USER":"$USER" "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 2. Install deps + build.
echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
npm run build

echo "==> Build complete. Static files are in $APP_DIR/dist"
echo "==> Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Done. Visit https://admin.thecorps.in"
