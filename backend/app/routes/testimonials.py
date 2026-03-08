from fastapi import APIRouter, HTTPException
from typing import List
from app.models import TestimonialCreate, TestimonialUpdate, TestimonialOut
from app import db
import uuid

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])

@router.get("", response_model=List[TestimonialOut])
async def get_all_testimonials():
    cursor = db.get_db().testimonials.find()
    testimonials = await cursor.to_list(length=100)
    for t in testimonials:
        t["id"] = str(t["_id"])
    return testimonials

@router.get("/{t_id}", response_model=TestimonialOut)
async def get_testimonial(t_id: str):
    t = await db.get_db().testimonials.find_one({"_id": t_id})
    if t:
        t["id"] = str(t["_id"])
        return t
    raise HTTPException(status_code=404, detail="Testimonial not found")

@router.post("", response_model=TestimonialOut, status_code=201)
async def create_testimonial(t_in: TestimonialCreate):
    t_dict = t_in.model_dump()
    t_dict["_id"] = str(uuid.uuid4())
    await db.get_db().testimonials.insert_one(t_dict)
    t_dict["id"] = t_dict["_id"]
    return t_dict

@router.patch("/{t_id}", response_model=TestimonialOut)
async def update_testimonial(t_id: str, t_update: TestimonialUpdate):
    update_data = {k: v for k, v in t_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().testimonials.update_one({"_id": t_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
    return await get_testimonial(t_id)

@router.delete("/{t_id}", status_code=204)
async def delete_testimonial(t_id: str):
    result = await db.get_db().testimonials.delete_one({"_id": t_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return None
