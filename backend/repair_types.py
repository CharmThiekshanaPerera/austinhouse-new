import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.settings import settings

async def find_bad_types():
    print(f"Connecting to database: {settings.mongodb_db}...")
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]
    services = await db.services.find({}).to_list(100)
    
    fixed = 0
    for s in services:
        updates = {}
        for k in ['duration', 'price']:
            val = s.get(k)
            # If it's literally just a number instead of string, cast it
            if type(val) in (int, float):
                updates[k] = str(val)
        if updates:
            print(f"Fixing {s['_id']}: {updates}")
            await db.services.update_one({'_id': s['_id']}, {'$set': updates})
            fixed += 1
            
    print(f"Total fixed: {fixed}")
    
    # Just to verify, let's print all types
    print("Verification:")
    services = await db.services.find({}).to_list(100)
    for s in services:
        if type(s.get('duration')) != str or type(s.get('price')) != str:
            print(f"STILL BAD: {s['_id']} duration={type(s.get('duration'))} price={type(s.get('price'))}")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(find_bad_types())
