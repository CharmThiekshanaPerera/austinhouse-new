from fastapi import APIRouter, HTTPException
from typing import List
from app.models import BookingCreate, BookingUpdate, BookingOut
from app import db
import uuid

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.get("", response_model=List[BookingOut])
async def get_all_bookings():
    cursor = db.get_db().bookings.find()
    booking_list = await cursor.to_list(length=100)
    for booking in booking_list:
        booking["id"] = str(booking["_id"])
    return booking_list

@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking(booking_id: str):
    booking = await db.get_db().bookings.find_one({"_id": booking_id})
    if booking:
        booking["id"] = str(booking["_id"])
        return booking
    raise HTTPException(status_code=404, detail="Booking not found")

@router.post("", response_model=BookingOut, status_code=201)
async def create_booking(booking: BookingCreate):
    booking_dict = booking.model_dump()
    booking_dict["_id"] = str(uuid.uuid4())
    await db.get_db().bookings.insert_one(booking_dict)
    booking_dict["id"] = booking_dict["_id"]
    return booking_dict

@router.patch("/{booking_id}", response_model=BookingOut)
async def update_booking(booking_id: str, booking_update: BookingUpdate):
    update_data = {k: v for k, v in booking_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().bookings.update_one({"_id": booking_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
    return await get_booking(booking_id)

@router.delete("/{booking_id}", status_code=204)
async def delete_booking(booking_id: str):
    result = await db.get_db().bookings.delete_one({"_id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return None
