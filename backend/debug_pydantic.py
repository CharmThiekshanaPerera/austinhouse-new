import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import settings
from app.models import ServiceOut

async def debug_validation():
    print(f"Connecting to database: {settings.mongodb_db}...")
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]
    services = await db.services.find({}).to_list(100)
    
    for s in services:
        doc = {**s}
        doc["id"] = doc.pop("_id")
        try:
            ServiceOut.model_validate(doc)
        except Exception as e:
            print("================================")
            print("FAILED DOCUMENT:", s['_id'])
            print(s)
            print("ERROR:")
            print(e)
            
    client.close()

if __name__ == "__main__":
    asyncio.run(debug_validation())
