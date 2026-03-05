import asyncio

from motor.motor_asyncio import AsyncIOMotorClient

from app.settings import settings


async def main() -> None:
    print("This will DELETE data from your MongoDB database.")
    print(f"URI: {settings.mongodb_uri}")
    print(f"DB:  {settings.mongodb_db}")
    print("")
    confirm = input("Type DELETE to remove ALL inventory records (anything else cancels): ").strip()
    if confirm != "DELETE":
        print("Cancelled.")
        return

    client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    try:
        await client.admin.command("ping")
        db = client[settings.mongodb_db]
        result = await db.inventory.delete_many({})
        print(f"Deleted inventory records: {result.deleted_count}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())

