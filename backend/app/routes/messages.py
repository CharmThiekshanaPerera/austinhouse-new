from fastapi import APIRouter, HTTPException
from typing import List
from app.models import ContactMessageCreate, ContactMessageUpdate, ContactMessageOut
from app import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("", response_model=List[ContactMessageOut])
async def get_all_contact_messages():
    cursor = db.get_db().messages.find()
    messages = await cursor.to_list(length=100)
    for msg in messages:
        msg["id"] = str(msg["_id"])
    return messages

@router.get("/{msg_id}", response_model=ContactMessageOut)
async def get_contact_message(msg_id: str):
    msg = await db.get_db().messages.find_one({"_id": msg_id})
    if msg:
        msg["id"] = str(msg["_id"])
        return msg
    raise HTTPException(status_code=404, detail="Message not found")

@router.post("", response_model=ContactMessageOut, status_code=201)
async def create_contact_message(msg: ContactMessageCreate):
    msg_dict = msg.model_dump()
    msg_dict["_id"] = str(uuid.uuid4())
    msg_dict["createdAt"] = datetime.utcnow().isoformat() + "Z"
    await db.get_db().messages.insert_one(msg_dict)
    msg_dict["id"] = msg_dict["_id"]
    return msg_dict

@router.patch("/{msg_id}", response_model=ContactMessageOut)
async def update_contact_message(msg_id: str, msg_update: ContactMessageUpdate):
    update_data = {k: v for k, v in msg_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().messages.update_one({"_id": msg_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
    return await get_contact_message(msg_id)

@router.delete("/{msg_id}", status_code=204)
async def delete_contact_message(msg_id: str):
    result = await db.get_db().messages.delete_one({"_id": msg_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return None
