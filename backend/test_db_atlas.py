from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://dbuseraustin:9czck3sGNhWBM0gJ@austinhouse.sg4zrml.mongodb.net/?appName=austinhouse"

print("Connecting to MongoDB Atlas...")
try:
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=5000)
    # Send a ping to confirm a successful connection
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Connection failed: {e}")
