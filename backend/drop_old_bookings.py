import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB", "austinhouse")
    client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]
    
    # Drop collections due to schema mismatch from old dev version
    await db.customers.drop()
    await db.waitlist.drop()
    print("✅ Dropped old customers and waitlist collections successfully.")

if __name__ == "__main__":
    asyncio.run(main())
