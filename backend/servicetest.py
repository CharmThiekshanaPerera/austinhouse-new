import asyncio
from uuid import uuid4

from motor.motor_asyncio import AsyncIOMotorClient

from app.settings import settings


async def main() -> None:
    client = AsyncIOMotorClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
    )

    test_id = f"tst_{uuid4().hex}"
    doc = {
        "_id": test_id,
        "image": "/uploads/test-service.jpg",
        "category": "Services",
        "title": "Test Service",
        "duration": "1 min",
        "price": "0",
        "rating": 5.0,
        "description": "Connectivity test service (auto-created).",
        "benefits": ["DB connectivity check"],
    }

    try:
        await client.admin.command("ping")
        db = client[settings.mongodb_db]

        await db.services.insert_one(doc)
        created = await db.services.find_one({"_id": test_id})

        if not created:
            raise RuntimeError("Inserted service not found")

        print("✅ Service insert/read OK")
        print(f"URI: {settings.mongodb_uri}")
        print(f"DB:  {settings.mongodb_db}")
        print(f"ID:  {test_id}")
    finally:
        try:
            db = client[settings.mongodb_db]
            await db.services.delete_one({"_id": test_id})
        finally:
            client.close()


if __name__ == "__main__":
    asyncio.run(main())
