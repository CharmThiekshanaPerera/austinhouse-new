import asyncio
from app import db
import json
from datetime import datetime
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)

async def check_collection(name, collection):
    print(f"--- {name} ---")
    cursor = collection.find().limit(5)
    docs = await cursor.to_list(length=5)
    
    if not docs:
        print("Empty")
    else:
        for doc in docs:
            print(json.dumps(doc, indent=2, cls=JSONEncoder))

async def main():
    await db.connect()
    try:
        await check_collection("Staff", db.get_db().staff)
        await check_collection("Customers", db.get_db().customers)
        await check_collection("Bookings", db.get_db().bookings)
        await check_collection("Waitlist", db.get_db().waitlist)
        await check_collection("Blog", db.get_db().blog)
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
