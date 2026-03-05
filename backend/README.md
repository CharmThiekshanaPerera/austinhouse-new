# Backend (Service Management)

Python FastAPI + MongoDB backend that manages **Services** only.

## Setup

1. Start MongoDB (local or Docker).
2. Create `backend/.env` from `backend/.env.example`.
3. Install deps:
   - `python -m venv .venv`
   - `.\.venv\Scripts\pip install -r backend\requirements.txt`

## CORS note

If your frontend runs on a different dev origin (e.g. `http://127.0.0.1:5173` or `http://localhost:8080`), include it in `ALLOWED_ORIGINS`.

## Run

- `.\.venv\Scripts\uvicorn app.main:app --app-dir backend --reload --port 8000`

## API

- `GET /health`
- `GET /api/services`
- `GET /api/services/{id}`
- `POST /api/services`
- `PUT /api/services/{id}`
- `PATCH /api/services/{id}`
- `DELETE /api/services/{id}`

## Cleanup (dev)

- Delete ALL inventory records:
  - `cd backend`
  - `..\..\.venv\Scripts\python cleandb.py`

- Delete ALL products + services + inventory:
  - `cd backend`
  - `..\..\.venv\Scripts\python cleandb_all.py`

