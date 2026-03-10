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
            },
            {
                "image": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop",
                "category": "Nails",
                "title": "Luxury Spa Pedicure",
                "duration": "45 min",
                "price": "$55",
                "rating": 4.7,
                "description": "Pamper your feet with a relaxing soak, scrub, and polish.",
                "benefits": ["Callus removal", "Moisturizing", "Flawless polish"]
            },
            {
                "image": "https://images.unsplash.com/photo-1595476108010-b4d1f10o676a?w=800&auto=format&fit=crop",
                "category": "Hair",
                "title": "Bridal Styling & Updo",
                "duration": "120 min",
                "price": "$150",
                "rating": 5.0,
                "description": "Elegant and long-lasting hair styling for your special day.",
                "benefits": ["Consultation included", "Long-lasting hold", "Accessory placement"]
            },
            {
                "image": "https://images.unsplash.com/photo-1629367494173-c78a56567877?w=800&auto=format&fit=crop",
                "category": "Laser",
                "title": "Full Body Laser Hair Removal",
                "duration": "180 min",
                "price": "$399",
                "rating": 4.9,
                "description": "Painless and permanent hair reduction using advanced laser technology.",
                "benefits": ["Permanent results", "Safe for all skin types", "Requires multiple sessions"]
            },
            {
                "image": "https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?w=800&auto=format&fit=crop",
                "category": "Injection",
                "title": "Botox Cosmetic (Per Unit)",
                "duration": "30 min",
                "price": "$12",
                "rating": 4.8,
                "description": "Smooth fine lines and wrinkles with FDA-approved injectables.",
                "benefits": ["Quick procedure", "No downtime", "Results last 3-4 months"]
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
            },
            {
                "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop",
                "name": "Purifying Clay Mask",
                "category": "Masks",
                "price": "$28.00",
                "priceNum": 28.00,
                "description": "Draws out impurities and minimizes pores with natural bentonite."
            },
            {
                "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop",
                "name": "Gentle Foaming Cleanser",
                "category": "Cleansers",
                "price": "$22.00",
                "priceNum": 22.00,
                "description": "A daily cleanser that removes makeup without stripping moisture."
            },
            {
                "image": "https://images.unsplash.com/photo-1571781526291-c477ebef0129?w=800&auto=format&fit=crop",
                "name": "SPF 50 Mineral Sunscreen",
                "category": "Sun Protection",
                "price": "$35.00",
                "priceNum": 35.00,
                "description": "Broad-spectrum protection with a sheer, non-greasy finish."
            },
            {
                "image": "https://images.unsplash.com/photo-1615397323145-a92c0199042a?w=800&auto=format&fit=crop",
                "name": "Rosewater Hydrating Toner",
                "category": "Toners",
                "price": "$18.00",
                "priceNum": 18.00,
                "description": "Balances pH and refreshes skin instantly."
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
            },
            {
                "name": "Jessica Taylor",
                "role": "Nurse Injector",
                "email": "jessica@austinhouse.com",
                "phone": "555-0103",
                "bio": "Registered Nurse specializing in Botox and dermal fillers.",
                "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop",
                "show_in_frontend": True
            },
            {
                "name": "Michael Rodriguez",
                "role": "Hair Stylist",
                "email": "michael@austinhouse.com",
                "phone": "555-0104",
                "bio": "Creative director with a passion for color correction and bridal hair.",
                "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop",
                "show_in_frontend": True
            },
            {
                "name": "Emily Davis",
                "role": "Master Nail Technician",
                "email": "emily@austinhouse.com",
                "phone": "555-0105",
                "bio": "Detail-oriented artist focused on nail health and intricate designs.",
                "image": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&auto=format&fit=crop",
                "show_in_frontend": True
            },
            {
                "name": "Amanda White",
                "role": "Laser Technician",
                "email": "amanda@austinhouse.com",
                "phone": "555-0106",
                "bio": "Certified laser specialist dedicated to safe and effective hair removal.",
                "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop",
                "show_in_frontend": False
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
