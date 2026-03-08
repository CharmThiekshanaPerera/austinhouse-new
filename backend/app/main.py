from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import db
from app.routes.services import router as services_router
from app.routes.products import router as products_router
from app.routes.inventory import router as inventory_router
from app.routes.uploads import router as uploads_router
from app.routes.bookings import router as bookings_router
from app.routes.staff import router as staff_router
from app.routes.customers import router as customers_router
from app.routes.waitlist import router as waitlist_router
from app.routes.blog import router as blog_router
from app.routes.testimonials import router as testimonials_router
from app.routes.auth import router as auth_router
from app.settings import settings
from pathlib import Path


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    try:
        yield
    finally:
        await db.disconnect()


app = FastAPI(title="Bright Living API", version="0.1.0", lifespan=lifespan, redirect_slashes=False)

allowed_origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(services_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(inventory_router, prefix="/api")
app.include_router(testimonials_router, prefix="/api")
app.include_router(uploads_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")
app.include_router(staff_router, prefix="/api")
app.include_router(customers_router, prefix="/api")
app.include_router(waitlist_router, prefix="/api")
app.include_router(blog_router, prefix="/api")

uploads_dir = Path(__file__).resolve().parents[1] / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
