from __future__ import annotations

from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db import get_db
from app.models import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


def _doc_to_product(doc: dict) -> ProductOut:
    doc = {**doc}
    doc["id"] = str(doc.pop("_id"))
    return ProductOut.model_validate(doc)


@router.get("", response_model=List[ProductOut])
async def list_products(db: AsyncIOMotorDatabase = Depends(get_db)) -> List[ProductOut]:
    cursor = db.products.find({}, sort=[("_id", 1)])
    docs = await cursor.to_list(length=1000)
    return [_doc_to_product(d) for d in docs]


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> ProductOut:
    doc = await db.products.find_one({"_id": product_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return _doc_to_product(doc)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(payload: ProductCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> ProductOut:
    product_id = payload.id or f"p_{uuid4().hex}"
    doc = payload.model_dump(exclude={"id"})
    doc["_id"] = product_id

    try:
        await db.products.insert_one(doc)
    except Exception:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product id already exists")

    created = await db.products.find_one({"_id": product_id})
    return _doc_to_product(created)


@router.put("/{product_id}", response_model=ProductOut)
async def replace_product(
    product_id: str, payload: ProductCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProductOut:
    doc = payload.model_dump(exclude={"id"})
    doc["_id"] = product_id
    result = await db.products.replace_one({"_id": product_id}, doc, upsert=False)
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    updated = await db.products.find_one({"_id": product_id})
    return _doc_to_product(updated)


@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str, payload: ProductUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> ProductOut:
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        doc = await db.products.find_one({"_id": product_id})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return _doc_to_product(doc)

    result = await db.products.update_one({"_id": product_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    updated = await db.products.find_one({"_id": product_id})
    return _doc_to_product(updated)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_product(product_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> Response:
    await db.inventory.delete_many({"product_id": product_id})
    result = await db.products.delete_one({"_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
