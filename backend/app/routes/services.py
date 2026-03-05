from __future__ import annotations

from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db import get_db
from app.models import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter(prefix="/services", tags=["services"])


def _doc_to_service(doc: dict) -> ServiceOut:
    doc = {**doc}
    doc["id"] = doc.pop("_id")
    return ServiceOut.model_validate(doc)


@router.get("", response_model=List[ServiceOut])
async def list_services(db: AsyncIOMotorDatabase = Depends(get_db)) -> List[ServiceOut]:
    cursor = db.services.find({}, sort=[("_id", 1)])
    docs = await cursor.to_list(length=1000)
    return [_doc_to_service(d) for d in docs]


@router.get("/{service_id}", response_model=ServiceOut)
async def get_service(service_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> ServiceOut:
    doc = await db.services.find_one({"_id": service_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return _doc_to_service(doc)


@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
async def create_service(payload: ServiceCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> ServiceOut:
    service_id = payload.id or f"s_{uuid4().hex}"
    doc = payload.model_dump(exclude={"id"})
    doc["_id"] = service_id

    try:
        await db.services.insert_one(doc)
    except Exception:
        # Duplicate key, etc.
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Service id already exists")

    created = await db.services.find_one({"_id": service_id})
    return _doc_to_service(created)


@router.put("/{service_id}", response_model=ServiceOut)
async def replace_service(
    service_id: str, payload: ServiceCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> ServiceOut:
    doc = payload.model_dump(exclude={"id"})
    doc["_id"] = service_id
    result = await db.services.replace_one({"_id": service_id}, doc, upsert=False)
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    updated = await db.services.find_one({"_id": service_id})
    return _doc_to_service(updated)


@router.patch("/{service_id}", response_model=ServiceOut)
async def update_service(
    service_id: str, payload: ServiceUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> ServiceOut:
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        doc = await db.services.find_one({"_id": service_id})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
        return _doc_to_service(doc)

    result = await db.services.update_one({"_id": service_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    updated = await db.services.find_one({"_id": service_id})
    return _doc_to_service(updated)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_service(service_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> Response:
    result = await db.services.delete_one({"_id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
