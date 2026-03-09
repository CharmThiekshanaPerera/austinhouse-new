# Austin House - DigitalOcean Deployment Guide

This repository is optimized for deployment entirely on a **DigitalOcean Droplet (Ubuntu 24.04)** using Nginx, PM2, Node.js, and Python.

## 1. Environment Variables

For security, the actual `.env` files are not tracked in GitHub. You must manually create them on your Droplet.

### Backend Secrets (`backend/.env`)

On the server, run `nano /var/www/austinhouse-new/backend/.env` and insert your secure variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/austinhouse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_string
ALLOWED_ORIGINS=http://188.166.255.147,http://yourdomain.com
```

### Frontend Variables (`.env.production`)

If you require frontend variables at build time, run `nano /var/www/austinhouse-new/.env.production`:

```env
VITE_API_URL=/api
```

---

## 2. Server Architecture

- **Frontend:** Built with `npm run build` and served as purely static files from the `/dist` directory via **Nginx** on Port 80.
- **Backend:** FastAPI running locally on Port 8000 managed by **PM2** (to ensure it stays alive and restarts on crashes/reboots).
- **Reverse Proxy:** **Nginx** listens on Port 80. Requests to `/` serve the React application. Requests to `/api/*` are natively proxied to `http://127.0.0.1:8000`.

---

## 3. How to Update Your Live Server

Whenever you push new code to your `main` branch on GitHub, you can easily pull the changes and restart the application using the automated shell script we created.

1. SSH into your Droplet:

   ```bash
   ssh root@188.166.255.147
   ```

2. Navigate to your project directory:

   ```bash
   cd /var/www/austinhouse-new
   ```

3. Run the automated deployment script:

   ```bash
   bash deploy.sh
   ```

   **What this script does:**
   - Runs `git pull origin main` to fetch your latest code.
   - Runs `npm install` and `npm run build` to compile the new React frontend.
   - Activates the Python virtual environment and installs any new `requirements.txt` packages.
   - Restarts the `austinhouse-backend` PM2 process.
   - Restarts Nginx.

Your live website will instantly reflect the new changes with essentially zero downtime!
