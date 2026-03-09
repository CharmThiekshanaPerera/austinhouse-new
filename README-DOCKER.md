# 🐳 Austin House Docker Deployment Guide

This guide provides everything you need to build, test, and deploy the entire Austin House ecosystem using Docker.

## 🏗️ Architecture

The Docker setup consists of two main containers:

1. **`austinhouse_backend`**: FastAPI Python server.
2. **`austinhouse_frontend`**: Nginx server serving the built React assets and proxying `/api` traffic.

---

## 💻 Local Development & Testing

### 1. Pre-requisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Ensure ports **80** and **8000** are available.

### 2. Getting Started

To boot the entire application stack:

```bash
docker-compose up --build -d
```

### 3. Database Seeding

After the containers are running, you must seed the database to create the default admin user and initial data:

```bash
docker exec -it austinhouse_backend python seed_data.py
```

- **Admin Username:** `admin`
- **Admin Password:** `admin123`

### 4. Accessing the Application

- **Frontend / Website:** [http://localhost](http://localhost)
- **Admin Panel:** [http://localhost/admin](http://localhost/admin)
- **API Documentation:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

---

## 🚀 Production Deployment (DigitalOcean)

To deploy this containerized setup on your DigitalOcean Droplet:

1. **Clone the Repo:**

    ```bash
    git clone <your-repo-url> /var/www/austinhouse-new
    cd /var/www/austinhouse-new
    ```

2. **Setup Environment Variables:**
    Ensure `docker-compose.yml` has the correct `MONGODB_URI` and `JWT_SECRET`.

3. **Run with Docker Compose:**

    ```bash
    docker-compose up --build -d
    ```

4. **Automated CI/CD:**
    The project includes a GitHub Actions workflow in `.github/workflows/deploy.yml`. Once you add your `DROPLET_IP`, `DROPLET_USERNAME`, and `DROPLET_SSH_KEY` to GitHub Secrets, every push to `main` will automatically update the containers on your server.

---

## 🛠️ Docker Command Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Start everything** | `docker-compose up -d` |
| **Stop everything** | `docker-compose down` |
| **Rebuild & Start** | `docker-compose up --build -d` |
| **Update Python Code** | `docker-compose restart backend` |
| **Update React Frontend** | `docker-compose up --build -d frontend` |
| **View Backend Logs** | `docker logs -f austinhouse_backend` |
| **Reset Database** | `docker exec -it austinhouse_backend python cleandb_all.py` |
| **Seed Data** | `docker exec -it austinhouse_backend python seed_data.py` |

---

## 📁 Persistence

Uploaded images and files are stored in a persistent Docker volume called `backend_uploads`. This ensures your media files remain safe even if you stop or rebuild the containers.
