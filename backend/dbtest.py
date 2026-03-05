import asyncio

from motor.motor_asyncio import AsyncIOMotorClient

from app.settings import settings


async def main() -> None:
    client = AsyncIOMotorClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
    )
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected")
        print(f"URI: {settings.mongodb_uri}")
        print(f"DB:  {settings.mongodb_db}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
