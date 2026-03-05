from __future__ import annotations

from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db import get_db
from app.models import InventoryCreate, InventoryOut, InventoryStatus, InventoryUpdate

router = APIRouter(prefix="/inventory", tags=["inventory"])


def _compute_status(stock_qty: int, reorder_level: int) -> InventoryStatus:
    if stock_qty == 0:
        return "Out of Stock"
    if stock_qty <= reorder_level:
        return "Low Stock"
    return "In Stock"


def _doc_to_inventory(doc: dict) -> InventoryOut:
    doc = {**doc}
    doc["id"] = doc.pop("_id")
    return InventoryOut.model_validate(doc)


async def _ensure_product_exists(db: AsyncIOMotorDatabase, product_id: str) -> None:
    exists = await db.products.find_one({"_id": product_id}, projection={"_id": 1})
    if not exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid product_id")


@router.get("", response_model=List[InventoryOut])
async def list_inventory(db: AsyncIOMotorDatabase = Depends(get_db)) -> List[InventoryOut]:
    cursor = db.inventory.find({}, sort=[("product_id", 1), ("_id", 1)])
    docs = await cursor.to_list(length=1000)
    return [_doc_to_inventory(d) for d in docs]


@router.get("/{inventory_id}", response_model=InventoryOut)
async def get_inventory(inventory_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> InventoryOut:
    doc = await db.inventory.find_one({"_id": inventory_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")
    return _doc_to_inventory(doc)


@router.post("", response_model=InventoryOut, status_code=status.HTTP_201_CREATED)
async def create_inventory(payload: InventoryCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> InventoryOut:
    await _ensure_product_exists(db, payload.product_id)

    existing = await db.inventory.find_one({"product_id": payload.product_id}, projection={"_id": 1})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Inventory record already exists for this product_id")

    inventory_id = f"inv_{uuid4().hex}"
    status_val = _compute_status(payload.stock_qty, payload.reorder_level)
    doc = payload.model_dump()
    doc["_id"] = inventory_id
    doc["status"] = status_val

    await db.inventory.insert_one(doc)
    created = await db.inventory.find_one({"_id": inventory_id})
    return _doc_to_inventory(created)


@router.put("/{inventory_id}", response_model=InventoryOut)
async def replace_inventory(
    inventory_id: str, payload: InventoryCreate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> InventoryOut:
    await _ensure_product_exists(db, payload.product_id)

    other = await db.inventory.find_one({"product_id": payload.product_id, "_id": {"$ne": inventory_id}}, projection={"_id": 1})
    if other:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Inventory record already exists for this product_id")

    status_val = _compute_status(payload.stock_qty, payload.reorder_level)
    doc = payload.model_dump()
    doc["_id"] = inventory_id
    doc["status"] = status_val

    result = await db.inventory.replace_one({"_id": inventory_id}, doc, upsert=False)
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")
    updated = await db.inventory.find_one({"_id": inventory_id})
    return _doc_to_inventory(updated)


@router.patch("/{inventory_id}", response_model=InventoryOut)
async def update_inventory(
    inventory_id: str, payload: InventoryUpdate, db: AsyncIOMotorDatabase = Depends(get_db)
) -> InventoryOut:
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        doc = await db.inventory.find_one({"_id": inventory_id})
        if not doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")
        return _doc_to_inventory(doc)

    current = await db.inventory.find_one({"_id": inventory_id})
    if not current:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")

    if "product_id" in updates:
        await _ensure_product_exists(db, str(updates["product_id"]))
        other = await db.inventory.find_one({"product_id": updates["product_id"], "_id": {"$ne": inventory_id}}, projection={"_id": 1})
        if other:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Inventory record already exists for this product_id")

    next_stock = int(updates.get("stock_qty", current.get("stock_qty", 0)))
    next_reorder = int(updates.get("reorder_level", current.get("reorder_level", 0)))
    updates["status"] = _compute_status(next_stock, next_reorder)

    await db.inventory.update_one({"_id": inventory_id}, {"$set": updates})
    updated = await db.inventory.find_one({"_id": inventory_id})
    return _doc_to_inventory(updated)


@router.delete("/{inventory_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
async def delete_inventory(inventory_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> Response:
    result = await db.inventory.delete_one({"_id": inventory_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory record not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

