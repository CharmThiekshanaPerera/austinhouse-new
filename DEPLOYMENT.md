# 🚀 Austin House - Production DigitalOcean Docker Deployment Guide

This guide outlines exactly how to deploy the containerized Austin House application to a live DigitalOcean Droplet running Docker.

## 🌟 Prerequisites

1. A DigitalOcean Droplet running Ubuntu (22.04 or 24.04 recommended).
2. SSH access to your Droplet.
3. [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on the Droplet.

---

## 🛠️ Step 1: Initial Server Setup

SSH into your Droplet as the `root` user:

```bash
ssh root@<your_droplet_ip>
```

Install Docker and Docker Compose (if not already installed):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
systemctl enable docker
systemctl start docker
```

---

## 📦 Step 2: Clone the Project

Navigate to your web directory (or create it) and clone your repository:

```bash
mkdir -p /var/www
cd /var/www

# Replace this URL with your actual GitHub repository URL
git clone https://github.com/<your-username>/austinhouse-new.git
cd austinhouse-new
```

---

## 🔐 Step 3: Configure Environment Variables

For security, the actual `.env` files must be created manually on the server. The containers rely on the variables defined in `docker-compose.yml`.

If you prefer to load variables directly from a `.env` file instead of defining them in `docker-compose.yml`, you should create one:

```bash
cd /var/www/austinhouse-new/backend
nano .env
```

Paste your secure production variables:

```env
MONGODB_URI=mongodb+srv://<admin>:<password>@cluster0.exmple.mongodb.net/austinhouse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_secure_string_here
ALLOWED_ORIGINS=http://<your_droplet_ip>,https://<your_domain.com>
```

*(Press `Ctrl+X`, then `Y`, then `Enter` to save and exit).*

---

## 🏗️ Step 4: Build and Launch the Containers

Now, run Docker Compose safely in detached mode to build the images and launch the application:

```bash
cd /var/www/austinhouse-new
docker-compose up --build -d
```

Docker will compile the frontend into an Nginx web server and boot the FastAPI backend. Your application is now live on port 80!

---

## 🗄️ Step 5: Seed the Production Database (First Time Only)

Once the containers are successfully running, populate your production database with the initial Admin user and default data:

```bash
docker exec -it austinhouse_backend python seed_data.py
```

Your live admin panel can now be accessed at `http://<your_droplet_ip>/admin` using `admin` / `admin123`.

---

## ⚡ Step 6: Automated CI/CD (GitHub Actions)

Your project already has a CI/CD pipeline built-in (`.github/workflows/deploy.yml`)! You will never have to manually log in to your server to deploy changes again.

To activate it, add the following three **Secrets** to your GitHub repository settings (`Settings` -> `Secrets and variables` -> `Actions`):

1. **`DROPLET_IP`** : The public IP address of your DigitalOcean Droplet.
2. **`DROPLET_USERNAME`** : `root`
3. **`DROPLET_SSH_KEY`** : Your private SSH key associated with the Droplet.

Now, whenever you push code to the `main` branch, GitHub will automatically SSH into your server, navigate to `/var/www/austinhouse-new`, and execute your `deploy.sh` script to pull the latest code and rebuild the containers.

---

## 🧰 Useful Production Docker Commands

If you ever need to manually manage your production server, SSH in and use these commands:

- **Check server logs (Backend):** `docker logs -f austinhouse_backend`
- **Check server logs (Frontend):** `docker logs -f austinhouse_frontend`
- **Restart the whole app:** `docker-compose restart`
- **Hard rebuild and update:** `docker-compose down && docker-compose up --build -d`
