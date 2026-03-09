import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from app.settings import settings
import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_data():
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]
    
    print(f"Connecting to database: {settings.mongodb_db}")

    # 1. Seed Admin User
    print("Seeding Admin User...")
    users_coll = db["users"]
    admin_exists = await users_coll.find_one({"username": "admin"})
    if not admin_exists:
        await users_coll.insert_one({
            "username": "admin",
            "password_hash": pwd_context.hash("admin123"),
            "role": "admin"
        })
        print("✅ Admin user created (admin / admin123)")
    else:
        print("ℹ️ Admin user already exists")

    # 2. Seed Services
    print("Seeding Services...")
    services_coll = db["services"]
    if await services_coll.count_documents({}) == 0:
        services = [
            {
                "image": "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop",
                "category": "Facial",
                "title": "Signature Deep Cleanse",
                "duration": "60 min",
                "price": "$85",
                "rating": 4.9,
                "description": "Our most popular facial treatment for a glowing, healthy skin.",
                "benefits": ["Deep pore cleansing", "Exfoliation", "Hydrating mask"]
            },
            {
                "image": "https://images.unsplash.com/photo-1544161515-4ae6ce6ca8b8?w=800&auto=format&fit=crop",
                "category": "Massage",
                "title": "Therapeutic Massage",
                "duration": "90 min",
                "price": "$120",
                "rating": 4.8,
                "description": "Relieve stress and muscle tension with our customized massage therapy.",
                "benefits": ["Muscle relaxation", "Stress reduction", "Improved circulation"]
            }
        ]
        await services_coll.insert_many(services)
        print(f"✅ Created {len(services)} services")
    else:
        print("ℹ️ Services already exist")

    # 3. Seed Products
    print("Seeding Products...")
    products_coll = db["products"]
    if await products_coll.count_documents({}) == 0:
        products = [
            {
                "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop",
                "name": "Luxury Night Cream",
                "category": "Skincare",
                "price": "$45.00",
                "priceNum": 45.00,
                "description": "Deeply hydrating night cream with hyaluronic acid."
            },
            {
                "image": "https://images.unsplash.com/photo-1584949514123-474cfa705df3?w=800&auto=format&fit=crop",
                "name": "Organic Face Serum",
                "category": "Skincare",
                "price": "$32.00",
                "priceNum": 32.00,
                "description": "Vitamin C serum for bright and even skin tone."
            }
        ]
        await products_coll.insert_many(products)
        print(f"✅ Created {len(products)} products")
    else:
        print("ℹ️ Products already exist")

    # 4. Seed Staff
    print("Seeding Staff...")
    staff_coll = db["staff"]
    if await staff_coll.count_documents({}) == 0:
        staff = [
            {
                "name": "Sarah Miller",
                "role": "Lead Esthetician",
                "email": "sarah@austinhouse.com",
                "phone": "555-0101",
                "bio": "Expert in advanced skincare treatments with 10 years experience.",
                "image": "https://images.unsplash.com/photo-1594744803329-a584afbca9df?w=400&auto=format&fit=crop",
                "show_in_frontend": True
            },
            {
                "name": "David Chen",
                "role": "Massage Therapist",
                "email": "david@austinhouse.com",
                "phone": "555-0102",
                "bio": "Specialized in deep tissue and sports massage therapy.",
                "image": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop",
                "show_in_frontend": True
            }
        ]
        await staff_coll.insert_many(staff)
        print(f"✅ Created {len(staff)} staff members")
    else:
        print("ℹ️ Staff already exists")

    client.close()
    print("🏁 Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_data())
