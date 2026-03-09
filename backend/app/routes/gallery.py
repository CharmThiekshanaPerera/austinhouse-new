from fastapi import APIRouter, HTTPException
from typing import List
from app.models import GalleryImageCreate, GalleryImageUpdate, GalleryImageOut, BeforeAfterCreate, BeforeAfterUpdate, BeforeAfterOut
from app import db
import uuid

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("/images", response_model=List[GalleryImageOut])
async def get_all_gallery_images():
    cursor = db.get_db().gallery_images.find()
    images = await cursor.to_list(length=100)
    for img in images:
        img["id"] = str(img["_id"])
    return images

@router.post("/images", response_model=GalleryImageOut, status_code=201)
async def create_gallery_image(img: GalleryImageCreate):
    img_dict = img.model_dump()
    img_dict["_id"] = str(uuid.uuid4())
    await db.get_db().gallery_images.insert_one(img_dict)
    img_dict["id"] = img_dict["_id"]
    return img_dict

@router.patch("/images/{img_id}", response_model=GalleryImageOut)
async def update_gallery_image(img_id: str, img_update: GalleryImageUpdate):
    update_data = {k: v for k, v in img_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().gallery_images.update_one({"_id": img_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
    
    img = await db.get_db().gallery_images.find_one({"_id": img_id})
    if img:
        img["id"] = str(img["_id"])
        return img
    raise HTTPException(status_code=404, detail="Image not found")

@router.delete("/images/{img_id}", status_code=204)
async def delete_gallery_image(img_id: str):
    result = await db.get_db().gallery_images.delete_one({"_id": img_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return None

# Before/After Pairs API

@router.get("/before-after", response_model=List[BeforeAfterOut])
async def get_all_before_afters():
    cursor = db.get_db().gallery_before_after.find()
    pairs = await cursor.to_list(length=100)
    for pair in pairs:
        pair["id"] = str(pair["_id"])
    return pairs

@router.post("/before-after", response_model=BeforeAfterOut, status_code=201)
async def create_before_after(pair: BeforeAfterCreate):
    pair_dict = pair.model_dump()
    pair_dict["_id"] = str(uuid.uuid4())
    await db.get_db().gallery_before_after.insert_one(pair_dict)
    pair_dict["id"] = pair_dict["_id"]
    return pair_dict

@router.patch("/before-after/{pair_id}", response_model=BeforeAfterOut)
async def update_before_after(pair_id: str, pair_update: BeforeAfterUpdate):
    update_data = {k: v for k, v in pair_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().gallery_before_after.update_one({"_id": pair_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Before/After pair not found")
    
    pair = await db.get_db().gallery_before_after.find_one({"_id": pair_id})
    if pair:
        pair["id"] = str(pair["_id"])
        return pair
    raise HTTPException(status_code=404, detail="Before/After pair not found")

@router.delete("/before-after/{pair_id}", status_code=204)
async def delete_before_after(pair_id: str):
    result = await db.get_db().gallery_before_after.delete_one({"_id": pair_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Before/After pair not found")
    return None
