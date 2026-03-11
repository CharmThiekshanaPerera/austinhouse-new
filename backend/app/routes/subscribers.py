from __future__ import annotations

import datetime
from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db import get_db
from app.models import SubscriberCreate, SubscriberOut

router = APIRouter(prefix="/subscribers", tags=["subscribers"])


def _doc_to_subscriber(doc: dict) -> SubscriberOut:
    doc = {**doc}
    doc["id"] = str(doc.pop("_id"))
    return SubscriberOut.model_validate(doc)


@router.get("", response_model=List[SubscriberOut])
async def list_subscribers(db: AsyncIOMotorDatabase = Depends(get_db)) -> List[SubscriberOut]:
    cursor = db.subscribers.find({}, sort=[("created_at", -1)])
    docs = await cursor.to_list(length=1000)
    return [_doc_to_subscriber(d) for d in docs]


@router.post("", response_model=SubscriberOut, status_code=status.HTTP_201_CREATED)
async def create_subscriber(payload: SubscriberCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> SubscriberOut:
    existing = await db.subscribers.find_one({"email": payload.email.lower()})
    if existing:
        return _doc_to_subscriber(existing)

    subscriber_id = f"sub_{uuid4().hex}"
    doc = {
        "_id": subscriber_id,
        "email": payload.email.lower(),
        "active": True,
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
    }

    try:
        await db.subscribers.insert_one(doc)
    except Exception:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Subscriber could not be created")

    created = await db.subscribers.find_one({"_id": subscriber_id})
    return _doc_to_subscriber(created)


@router.patch("/{subscriber_id}", response_model=SubscriberOut)
async def update_subscriber(
    subscriber_id: str, payload: SubscriberUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> SubscriberOut:
    result = await db.subscribers.update_one(
        {"_id": subscriber_id}, {"$set": payload.model_dump(exclude_unset=True)}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")

    updated = await db.subscribers.find_one({"_id": subscriber_id})
    return _doc_to_subscriber(updated)


@router.delete("/{subscriber_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_subscriber(subscriber_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> Response:
    result = await db.subscribers.delete_one({"_id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriber not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
