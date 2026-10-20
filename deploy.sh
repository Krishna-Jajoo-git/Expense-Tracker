#!/usr/bin/env bash

# ==============================================================================
# Expense Tracker - AWS EC2 Automated Deployment Script (Ubuntu 22.04 / 24.04)
# ==============================================================================

set -e

APP_DIR="/var/www/expense-tracker"
NGINX_CONF_AVAILABLE="/etc/nginx/sites-available/expense-tracker"
NGINX_CONF_ENABLED="/etc/nginx/sites-enabled/expense-tracker"

echo "=========================================================="
echo " Starting Expense Tracker Deployment on AWS EC2"
echo "=========================================================="

# 1. Update package lists
echo "--> Updating system packages..."
sudo apt-get update -y

# 2. Install Node.js LTS (v20.x) if not already installed
if ! command -v node &> /dev/null; then
  echo "--> Installing Node.js LTS (v20.x)..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "--> Node.js is already installed ($(node -v))"
fi

# 3. Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
  echo "--> Installing Nginx..."
  sudo apt-get install -y nginx
  sudo systemctl enable nginx
  sudo systemctl start nginx
else
  echo "--> Nginx is already installed ($(nginx -v 2>&1))"
fi

# 4. Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
  echo "--> Installing PM2 process manager globally..."
  sudo npm install -g pm2
  sudo pm2 startup systemd -u $USER --hp $HOME || true
else
  echo "--> PM2 is already installed ($(pm2 -v))"
fi

# 5. Navigate to application directory
cd "$APP_DIR" || { echo "Directory $APP_DIR not found. Exiting."; exit 1; }

# 6. Ensure logs directory exists
mkdir -p logs

# 7. Setup Backend Dependencies & Environment
echo "--> Installing backend dependencies..."
cd "$APP_DIR/server"
npm ci || npm install --production=false

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "--> Creating server/.env from template..."
    cp .env.example .env
    echo "NOTE: Please verify server/.env with your production MongoDB URI!"
  fi
fi

# 8. Setup Frontend Dependencies & Build Production Bundle
echo "--> Installing frontend dependencies and building static assets..."
cd "$APP_DIR/client"
npm ci || npm install
npm run build

# 9. Configure Nginx Server Block
echo "--> Configuring Nginx reverse proxy..."
sudo cp "$APP_DIR/nginx.conf" "$NGINX_CONF_AVAILABLE"
sudo ln -sf "$NGINX_CONF_AVAILABLE" "$NGINX_CONF_ENABLED"

# Remove default site if present to avoid port 80 conflicts
if [ -f /etc/nginx/sites-enabled/default ]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi

# Set proper permissions for static web assets
sudo chown -R www-data:www-data "$APP_DIR/client/dist"
sudo chmod -R 755 "$APP_DIR/client/dist"

# Test and reload Nginx
echo "--> Testing Nginx configuration..."
sudo nginx -t
echo "--> Reloading Nginx service..."
sudo systemctl reload nginx

# 10. Start / Reload PM2 Backend Cluster
echo "--> Starting / Reloading backend with PM2..."
cd "$APP_DIR"
pm2 startOrReload ecosystem.config.js --env production
pm2 save

echo "=========================================================="
echo " Deployment Successfully Completed!"
echo " Backend Process Status:"
pm2 status
echo "=========================================================="
