from fastapi import APIRouter, HTTPException
from typing import List
from app.models import WaitlistEntryCreate, WaitlistEntryUpdate, WaitlistEntryOut
from app import db
import uuid

router = APIRouter(prefix="/waitlist", tags=["Waitlist"])

@router.get("/", response_model=List[WaitlistEntryOut])
async def get_all_waitlist_entries():
    cursor = db.get_db().waitlist.find()
    waitlist_entries = await cursor.to_list(length=100)
    for entry in waitlist_entries:
        entry["id"] = str(entry["_id"])
    return waitlist_entries

@router.get("/{entry_id}", response_model=WaitlistEntryOut)
async def get_waitlist_entry(entry_id: str):
    entry = await db.get_db().waitlist.find_one({"_id": entry_id})
    if entry:
        entry["id"] = str(entry["_id"])
        return entry
    raise HTTPException(status_code=404, detail="Waitlist entry not found")

@router.post("/", response_model=WaitlistEntryOut, status_code=201)
async def create_waitlist_entry(entry: WaitlistEntryCreate):
    entry_dict = entry.model_dump()
    entry_dict["_id"] = str(uuid.uuid4())
    await db.get_db().waitlist.insert_one(entry_dict)
    entry_dict["id"] = entry_dict["_id"]
    return entry_dict

@router.patch("/{entry_id}", response_model=WaitlistEntryOut)
async def update_waitlist_entry(entry_id: str, entry_update: WaitlistEntryUpdate):
    update_data = {k: v for k, v in entry_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().waitlist.update_one({"_id": entry_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Waitlist entry not found")
    return await get_waitlist_entry(entry_id)

@router.delete("/{entry_id}", status_code=204)
async def delete_waitlist_entry(entry_id: str):
    result = await db.get_db().waitlist.delete_one({"_id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Waitlist entry not found")
    return None
