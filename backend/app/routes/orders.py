from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import OrderCreate, OrderUpdate, OrderOut
from app import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=List[OrderOut])
async def get_all_orders():
    cursor = db.get_db().orders.find().sort("createdAt", -1)
    order_list = await cursor.to_list(length=100)
    for order in order_list:
        order["id"] = str(order["_id"])
    return order_list

@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: str):
    order = await db.get_db().orders.find_one({"_id": order_id})
    if order:
        order["id"] = str(order["_id"])
        return order
    raise HTTPException(status_code=404, detail="Order not found")

@router.post("", response_model=OrderOut, status_code=201)
async def create_order(order: OrderCreate):
    order_dict = order.model_dump()
    order_dict["_id"] = f"ord_{uuid.uuid4().hex[:12]}"
    order_dict["createdAt"] = datetime.now().isoformat()
    await db.get_db().orders.insert_one(order_dict)
    order_dict["id"] = order_dict["_id"]
    return order_dict

@router.patch("/{order_id}", response_model=OrderOut)
async def update_order(order_id: str, order_update: OrderUpdate):
    update_data = {k: v for k, v in order_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().orders.update_one({"_id": order_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Order not found")
    return await get_order(order_id)

@router.delete("/{order_id}", status_code=204)
async def delete_order(order_id: str):
    result = await db.get_db().orders.delete_one({"_id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return None
