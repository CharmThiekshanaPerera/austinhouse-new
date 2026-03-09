#!/bin/bash
# deploy.sh
# Automated deployment script for DigitalOcean Droplet

echo "=========================================="
echo "🚀 Starting Austin House Deployment Update"
echo "=========================================="

# 1. Pull latest code
echo "📦 Pulling latest changes from GitHub..."
git pull origin main

# 2. Build Frontend
echo "🌐 Installing frontend dependencies and building..."
npm install
npm run build

# 3. Update Backend
echo "⚙️ Updating backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# 4. Restart Backend Service
echo "🔄 Restarting FastAPI backend service (PM2)..."
pm2 restart austinhouse-backend

# 5. Restart Nginx (Optional, but good if proxy changes were pulled)
echo "🔀 Restarting Nginx Server..."
sudo systemctl restart nginx

echo "=========================================="
echo "✅ Deployment finished successfully!"
echo "=========================================="
