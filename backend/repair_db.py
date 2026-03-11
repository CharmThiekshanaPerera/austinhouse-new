import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import settings

async def fix_duration_types():
    print(f"Connecting to database: {settings.mongodb_db} for repairs...")
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]
    services = await db.services.find({}).to_list(100)
    
    fixed_count = 0
    for s in services:
        updates = {}
        dur = s.get('duration')
        if isinstance(dur, (int, float)):
            updates['duration'] = str(dur)
            
        pri = s.get('price')
        if isinstance(pri, (int, float)):
            updates['price'] = str(pri)
            
        if updates:
            print(f"Fixing service {s.get('_id')}: {updates}")
            await db.services.update_one({'_id': s['_id']}, {'$set': updates})
            fixed_count += 1
            
    print(f"Fixed {fixed_count} services. Database repair complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_duration_types())
