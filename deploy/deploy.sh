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

# 3. Update the API service (server/). Never re-seeds — that would overwrite
#    live data with mock defaults. First-time setup (.env, db push, seed,
#    pm2 start) is done manually; this only syncs deps/schema and restarts.
if [ -d "$APP_DIR/server" ]; then
  echo "==> Updating API service..."
  cd "$APP_DIR/server"
  npm ci
  npx prisma generate
  npx prisma db push
  if pm2 describe fdi-prime-api > /dev/null 2>&1; then
    pm2 restart fdi-prime-api --update-env
  else
    echo "!! fdi-prime-api not registered in pm2 — run first-time setup (see server/.env.example)"
  fi
  cd "$APP_DIR"
fi

echo "==> Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Done. Visit https://admin.thecorps.in"
