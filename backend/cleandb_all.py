import asyncio

from motor.motor_asyncio import AsyncIOMotorClient

from app.settings import settings


async def main() -> None:
    print("This will DELETE data from your MongoDB database.")
    print(f"URI: {settings.mongodb_uri}")
    print(f"DB:  {settings.mongodb_db}")
    print("")
    confirm = input("Type DELETE-ALL to remove products+services+inventory (anything else cancels): ").strip()
    if confirm != "DELETE-ALL":
        print("Cancelled.")
        return

    client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
    try:
        await client.admin.command("ping")
        db = client[settings.mongodb_db]

        inv = await db.inventory.delete_many({})
        prod = await db.products.delete_many({})
        svc = await db.services.delete_many({})

        print(f"Deleted inventory records: {inv.deleted_count}")
        print(f"Deleted product records:   {prod.deleted_count}")
        print(f"Deleted service records:   {svc.deleted_count}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())

