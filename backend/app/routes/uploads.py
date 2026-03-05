from __future__ import annotations

import os
import re
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, UploadFile, status


router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"


def _safe_filename(name: str) -> str:
    name = os.path.basename(name)
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._")
    return name or "file"


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only image uploads are allowed")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}_{_safe_filename(file.filename or 'image')}"
    dest = UPLOAD_DIR / filename

    data = await file.read()
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")

    dest.write_bytes(data)
    return {"url": f"/uploads/{filename}"}

