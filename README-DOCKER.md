# Local Docker Development Guide

This repository contains full Docker Compose support to allow you to easily spin up a perfect local replica of the production DigitalOcean environment.

## Architecture

Running Docker Compose spins up two interconnected containers:

1. **`austinhouse_backend`**: A Python container running the FastAPI backend internally on port 8000.
2. **`austinhouse_frontend`**: A multi-stage container that builds the React application and serves it via a lightweight Nginx web server. This Nginx instance is also configured to natively proxy any frontend requests starting with `/api/` directly to the `backend` container!

---

## 1. How to Test with Docker

### Prerequisites

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your computer.

### Quick Start

To spin up the entire application stack, simply open a terminal in this root directory (`austinhouse-new`) and execute:

```bash
docker-compose up --build -d
```

**What happens?**

- `-d` runs the containers in detached (background) mode.
- `--build` forces Docker to completely rebuild the React frontend (this make take a minute or two on the first run).
- Docker maps port `80` on your machine to the Nginx frontend container.

### Testing the Interface

Once the terminal finishes and the containers are running:

1. Open your browser.
2. Navigate directly to **`http://localhost`** (you no longer need `:8080`).
3. You should see the public Austin House website!
4. Navigate to **`http://localhost/admin`** to log in to the admin panel using `admin` / `admin123`.

To test the backend API docs directly, navigate to **`http://localhost:8000/api/docs`**.

---

## 2. Environment Variables

The `docker-compose.yml` file defaults to injecting dummy secrets and database paths into the backend.

If your backend container begins throwing MongoDB connection errors, please open `docker-compose.yml` and replace the placeholder `MONGODB_URI` string with your real MongoDB Atlas connection string before running `docker-compose up -d`.

---

## 3. Stopping the Application

To shut down the full-stack replica application, run:

```bash
docker-compose down
```

*(Note: Uploaded images in the admin panel are saved into a persistent Docker Volume `backend_uploads`, so your files are safe even when you shut the server down!).*
