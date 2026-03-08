# Deployment Guide — Austin House

**Stack:** MongoDB Atlas (DB) · Railway (backend) · Vercel (frontend)

> ✅ Production build verified — `npm run build` completes in ~9s with no errors.

---

## Prerequisites

- Code pushed to a **GitHub repository**
- Accounts on [MongoDB Atlas](https://cloud.mongodb.com), [Railway](https://railway.app), and [Vercel](https://vercel.com) (all free)

---

## Step 1 — MongoDB Atlas (Database)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → create a free account
2. New Project → create a free **M0** cluster (pick a region near your users)
3. **Database Access** → add a database user with a strong password
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. **Connect → Drivers** → copy the connection string:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=austinhouse
   ```

6. Replace `<username>` and `<password>` with your database user credentials

> **Save this URI** — you'll need it in Step 2 and for seeding the admin user.

---

## Step 2 — Deploy Backend to Railway

1. [railway.app](https://railway.app) → sign in with GitHub
2. **New Project → Deploy from GitHub repo** → select this repo
3. Railway auto-detects the `Dockerfile` and builds automatically
4. Go to your service → **Variables** → add these:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `MONGODB_DB` | `austinhouse` |
| `JWT_SECRET` | Generate: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_ALGORITHM` | `HS256` |
| `JWT_EXPIRE_MINUTES` | `480` |
| `ALLOWED_ORIGINS` | *(leave blank — fill in after Vercel deploys)* |

1. Click **Deploy** — wait for the build to complete
2. Copy your Railway URL (e.g. `https://austinhouse-production.up.railway.app`)

### Seed the Admin User

After the backend is live, open the **Railway dashboard terminal** for your service and run:

```bash
python seed_admin.py --username admin --password YOUR_SECURE_PASSWORD
```

Or run it locally against the Atlas DB:

```bash
cd backend
MONGODB_URI="mongodb+srv://..." python seed_admin.py --username admin --password YOUR_SECURE_PASSWORD
```

---

## Step 3 — Deploy Frontend to Vercel

1. [vercel.com](https://vercel.com) → sign in with GitHub
2. **Add New Project** → import this repo
3. Vercel auto-detects Vite — keep all defaults
4. Under **Environment Variables**, add:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | Your Railway URL from Step 2 |

1. Click **Deploy**
2. Copy your Vercel URL (e.g. `https://austinhouse.vercel.app`)

---

## Step 4 — Update CORS (Final Wiring)

1. Go back to **Railway → your service → Variables**
2. Set `ALLOWED_ORIGINS` to your Vercel URL:

   ```
   https://austinhouse.vercel.app
   ```

3. Railway auto-redeploys — done! ✅

---

## Step 5 — Verify Everything Works

| Check | URL |
|---|---|
| Backend health | `https://your-railway-url/health` |
| API docs (Swagger UI) | `https://your-railway-url/docs` |
| Frontend | `https://your-app.vercel.app` |
| Admin panel | `https://your-app.vercel.app/admin` |

Test the admin login with the credentials you set in `seed_admin.py`.

---

## Custom Domain (Optional)

- **Vercel**: Project Settings → Domains → add your domain → update DNS records
- **Railway**: Service Settings → Networking → Custom Domain
- After adding your domain, update `ALLOWED_ORIGINS` in Railway:

  ```
  https://austinhouse.vercel.app,https://yourdomain.com
  ```

---

## Environment Variable Reference

### Backend (`backend/.env.example`)

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=austinhouse
ALLOWED_ORIGINS=https://your-app.vercel.app
JWT_SECRET=your-long-random-secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=480
```

### Frontend (`.env.example`)

```env
VITE_API_BASE_URL=https://your-backend.up.railway.app
```

---

## Deployment Files in This Repo

| File | Purpose |
|---|---|
| `backend/Dockerfile` | Docker image for Railway |
| `backend/railway.toml` | Railway build + health check config |
| `backend/Procfile` | Fallback start command |
| `backend/.dockerignore` | Keeps Docker image lean |
| `backend/.env.example` | Backend env var template |
| `backend/seed_admin.py` | Create/update admin user in MongoDB |
| `.env.example` | Frontend env var template |
| `vercel.json` | React Router SPA rewrite rules + cache headers |
