from fastapi import APIRouter, HTTPException
from typing import List
from app.models import StaffCreate, StaffUpdate, StaffOut
from app import db
import uuid

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.get("/", response_model=List[StaffOut])
async def get_all_staff():
    cursor = db.get_db().staff.find()
    staff_list = await cursor.to_list(length=100)
    for staff in staff_list:
        staff["id"] = str(staff["_id"])
    return staff_list

@router.get("/{staff_id}", response_model=StaffOut)
async def get_staff(staff_id: str):
    staff = await db.get_db().staff.find_one({"_id": staff_id})
    if staff:
        staff["id"] = str(staff["_id"])
        return staff
    raise HTTPException(status_code=404, detail="Staff not found")

@router.post("/", response_model=StaffOut, status_code=201)
async def create_staff(staff: StaffCreate):
    staff_dict = staff.model_dump()
    staff_dict["_id"] = str(uuid.uuid4())
    await db.get_db().staff.insert_one(staff_dict)
    staff_dict["id"] = staff_dict["_id"]
    return staff_dict

@router.patch("/{staff_id}", response_model=StaffOut)
async def update_staff(staff_id: str, staff_update: StaffUpdate):
    update_data = {k: v for k, v in staff_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().staff.update_one({"_id": staff_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Staff not found")
    return await get_staff(staff_id)

@router.delete("/{staff_id}", status_code=204)
async def delete_staff(staff_id: str):
    result = await db.get_db().staff.delete_one({"_id": staff_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff not found")
    return None
