import urllib.request
import json
import ssl

endpoints = [
    "/api/services",
    "/api/products",
    "/api/bookings",
    "/api/staff",
    "/api/customers",
    "/api/waitlist",
    "/api/blog",
    "/api/testimonials",
    "/api/inventory"
]

base_url = "http://127.0.0.1:8000"

print("--- Testing API Endpoints ---")
all_success = True

for endpoint in endpoints:
    url = f"{base_url}{endpoint}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            data = json.loads(response.read().decode())
            if status == 200:
                print(f"✅ {endpoint} -> 200 OK (Returns {len(data)} items)")
            else:
                print(f"❌ {endpoint} -> Status {status}")
                all_success = False
    except Exception as e:
        print(f"❌ {endpoint} -> Error: {e}")
        all_success = False

print("-----------------------------")
if all_success:
    print("✅ All GET endpoints are working successfully!")
else:
    print("⚠️ Some endpoints failed.")
