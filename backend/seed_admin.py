"""
seed_admin.py — run once to create the initial admin user in MongoDB.

Usage:
    python seed_admin.py
    python seed_admin.py --username admin --password admin123

The script is idempotent: if the user already exists it updates the password hash.
"""
from __future__ import annotations

import argparse
import asyncio

from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

from app.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed(username: str, password: str) -> None:
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]
    collection = db["users"]

    password_hash = pwd_context.hash(password)

    existing = await collection.find_one({"username": username})
    if existing:
        await collection.update_one(
            {"username": username},
            {"$set": {"password_hash": password_hash, "role": "admin"}},
        )
        print(f"✅ Updated password for existing user '{username}'.")
    else:
        await collection.insert_one({
            "username": username,
            "password_hash": password_hash,
            "role": "admin",
        })
        print(f"✅ Admin user '{username}' created successfully.")

    client.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed admin user into MongoDB.")
    parser.add_argument("--username", default="admin", help="Admin username (default: admin)")
    parser.add_argument("--password", default="admin123", help="Admin password (default: admin123)")
    args = parser.parse_args()

    print(f"Seeding admin user: {args.username}")
    asyncio.run(seed(args.username, args.password))
