#!/bin/bash
# deploy.sh
# Automated deployment script for DigitalOcean Droplet using Docker

echo "=========================================="
echo "🚀 Starting Austin House Docker Deployment"
echo "=========================================="

# 1. Pull latest code
echo "📦 Pulling latest changes from GitHub..."
git pull origin main

# 2. Rebuild and Restart Containers
echo "🐳 Rebuilding and restarting Docker containers..."
docker-compose up --build -d

# 3. Clean up old images to save disk space
echo "🧹 Cleaning up old unused Docker images..."
docker image prune -af

echo "=========================================="
echo "✅ Deployment finished successfully!"
echo "=========================================="
