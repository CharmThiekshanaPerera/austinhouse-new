from fastapi import APIRouter, HTTPException
from typing import List
from app.models import CustomerCreate, CustomerUpdate, CustomerOut
from app import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("", response_model=List[CustomerOut])
async def get_all_customers():
    cursor = db.get_db().customers.find()
    customer_list = await cursor.to_list(length=100)
    for customer in customer_list:
        customer["id"] = str(customer["_id"])
    return customer_list

@router.get("/{customer_id}", response_model=CustomerOut)
async def get_customer(customer_id: str):
    customer = await db.get_db().customers.find_one({"_id": customer_id})
    if customer:
        customer["id"] = str(customer["_id"])
        return customer
    raise HTTPException(status_code=404, detail="Customer not found")

@router.post("", response_model=CustomerOut, status_code=201)
async def create_customer(customer: CustomerCreate):
    customer_dict = customer.model_dump()
    customer_dict["_id"] = str(uuid.uuid4())
    customer_dict["last_visit"] = customer_dict.get("last_visit") or datetime.now().isoformat()
    await db.get_db().customers.insert_one(customer_dict)
    customer_dict["id"] = customer_dict["_id"]
    return customer_dict

@router.patch("/{customer_id}", response_model=CustomerOut)
async def update_customer(customer_id: str, customer_update: CustomerUpdate):
    update_data = {k: v for k, v in customer_update.model_dump().items() if v is not None}
    if update_data:
        result = await db.get_db().customers.update_one({"_id": customer_id}, {"$set": update_data})
        if result.modified_count == 0 and result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
    return await get_customer(customer_id)

@router.delete("/{customer_id}", status_code=204)
async def delete_customer(customer_id: str):
    result = await db.get_db().customers.delete_one({"_id": customer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Customer not found")
    return None
