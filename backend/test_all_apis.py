"""
Comprehensive API Test Suite for Austin House Backend
Tests all CRUD operations across every route module.
"""

import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

PASS = "✅"
FAIL = "❌"
WARN = "⚠️ "

results = []

def request(method, path, body=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode() if body else None
    headers = {"Content-Type": "application/json", "User-Agent": "API-Tester/1.0"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.getcode()
            try:
                body = json.loads(resp.read().decode())
            except Exception:
                body = {}
            return status, body
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode())
        except Exception:
            body = {}
        return e.code, body
    except Exception as e:
        return None, str(e)

def check(label, condition, detail=""):
    icon = PASS if condition else FAIL
    msg = f"  {icon} {label}"
    if detail:
        msg += f"  [{detail}]"
    print(msg)
    results.append((label, condition))

def section(title):
    print(f"\n{'='*55}")
    print(f"  {title}")
    print(f"{'='*55}")

# ─── HEALTH ──────────────────────────────────────────────────
section("HEALTH")
status, body = request("GET", "/health")
check("GET /health → 200 OK", status == 200, str(body))

# ─── SERVICES ────────────────────────────────────────────────
section("SERVICES  /api/services")

status, data = request("GET", "/api/services")
check("GET  /api/services → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_service = {
    "image": "https://example.com/img.jpg",
    "category": "Test",
    "title": "Test Service",
    "duration": "60 min",
    "price": "$50",
    "rating": 4.5,
    "description": "A test service",
    "benefits": ["Benefit A", "Benefit B"]
}
status, created = request("POST", "/api/services", new_service)
check("POST /api/services → 201", status == 201, str(created.get("id", "")))
svc_id = created.get("id") if isinstance(created, dict) else None

if svc_id:
    status, got = request("GET", f"/api/services/{svc_id}")
    check(f"GET  /api/services/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/services/{svc_id}", {"title": "Updated Service"})
    check(f"PATCH /api/services/{{id}} → 200", status == 200, patched.get("title", ""))

    status, _ = request("DELETE", f"/api/services/{svc_id}")
    check(f"DELETE /api/services/{{id}} → 204", status == 204)
else:
    print(f"  {WARN} Skipping single-resource tests (no id returned)")

# ─── PRODUCTS ────────────────────────────────────────────────
section("PRODUCTS  /api/products")

status, data = request("GET", "/api/products")
check("GET  /api/products → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_product = {
    "image": "https://example.com/prod.jpg",
    "name": "Test Product",
    "category": "Skincare",
    "price": "$25.00",
    "priceNum": 25.0,
    "description": "A test product"
}
status, created = request("POST", "/api/products", new_product)
check("POST /api/products → 201", status == 201, str(created.get("id", "")))
prod_id = created.get("id") if isinstance(created, dict) else None

if prod_id:
    status, got = request("GET", f"/api/products/{prod_id}")
    check(f"GET  /api/products/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/products/{prod_id}", {"name": "Updated Product"})
    check(f"PATCH /api/products/{{id}} → 200", status == 200, patched.get("name", ""))

    status, _ = request("DELETE", f"/api/products/{prod_id}")
    check(f"DELETE /api/products/{{id}} → 204", status == 204)

# ─── STAFF ───────────────────────────────────────────────────
section("STAFF  /api/staff")

status, data = request("GET", "/api/staff")
check("GET  /api/staff → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_staff = {
    "name": "Test Staff",
    "role": "Therapist",
    "email": "test.staff@example.com",
    "phone": "0712345678",
    "bio": "Test bio",
    "image": None
}
status, created = request("POST", "/api/staff", new_staff)
check("POST /api/staff → 201", status == 201, str(created.get("id", "")))
staff_id = created.get("id") if isinstance(created, dict) else None

if staff_id:
    status, got = request("GET", f"/api/staff/{staff_id}")
    check(f"GET  /api/staff/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/staff/{staff_id}", {"role": "Senior Therapist"})
    check(f"PATCH /api/staff/{{id}} → 200", status == 200, patched.get("role", ""))

    status, _ = request("DELETE", f"/api/staff/{staff_id}")
    check(f"DELETE /api/staff/{{id}} → 204", status == 204)

# ─── CUSTOMERS ───────────────────────────────────────────────
section("CUSTOMERS  /api/customers")

status, data = request("GET", "/api/customers")
check("GET  /api/customers → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_customer = {
    "name": "Jane Test",
    "email": "jane.test@example.com",
    "phone": "0771234567",
    "total_spent": 0.0,
    "last_visit": None
}
status, created = request("POST", "/api/customers", new_customer)
check("POST /api/customers → 201", status == 201, str(created.get("id", "")))
cust_id = created.get("id") if isinstance(created, dict) else None

if cust_id:
    status, got = request("GET", f"/api/customers/{cust_id}")
    check(f"GET  /api/customers/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/customers/{cust_id}", {"total_spent": 150.0})
    check(f"PATCH /api/customers/{{id}} → 200", status == 200, str(patched.get("total_spent", "")))

    status, _ = request("DELETE", f"/api/customers/{cust_id}")
    check(f"DELETE /api/customers/{{id}} → 204", status == 204)

# ─── BOOKINGS ────────────────────────────────────────────────
section("BOOKINGS  /api/bookings")

status, data = request("GET", "/api/bookings")
check("GET  /api/bookings → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_booking = {
    "customer_name": "Test Customer",
    "customer_email": "test@example.com",
    "service_id": "test-service-id",
    "staff_id": None,
    "date": "2026-04-01",
    "time": "10:00",
    "status": "Pending",
    "notes": "Test booking"
}
status, created = request("POST", "/api/bookings", new_booking)
check("POST /api/bookings → 201", status == 201, str(created.get("id", "")))
booking_id = created.get("id") if isinstance(created, dict) else None

if booking_id:
    status, got = request("GET", f"/api/bookings/{booking_id}")
    check(f"GET  /api/bookings/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/bookings/{booking_id}", {"status": "Confirmed"})
    check(f"PATCH /api/bookings/{{id}} → 200", status == 200, patched.get("status", ""))

    status, _ = request("DELETE", f"/api/bookings/{booking_id}")
    check(f"DELETE /api/bookings/{{id}} → 204", status == 204)

# ─── WAITLIST ─────────────────────────────────────────────────
section("WAITLIST  /api/waitlist")

status, data = request("GET", "/api/waitlist")
check("GET  /api/waitlist → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_waitlist = {
    "name": "Waitlist Test",
    "email": "waitlist@example.com",
    "phone": "0761234567",
    "preferred_date": "2026-04-05",
    "service_id": "test-svc",
    "notes": "Test waitlist entry"
}
status, created = request("POST", "/api/waitlist", new_waitlist)
check("POST /api/waitlist → 201", status == 201, str(created.get("id", "")))
wl_id = created.get("id") if isinstance(created, dict) else None

if wl_id:
    status, got = request("GET", f"/api/waitlist/{wl_id}")
    check(f"GET  /api/waitlist/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/waitlist/{wl_id}", {"notes": "Updated notes"})
    check(f"PATCH /api/waitlist/{{id}} → 200", status == 200)

    status, _ = request("DELETE", f"/api/waitlist/{wl_id}")
    check(f"DELETE /api/waitlist/{{id}} → 204", status == 204)

# ─── BLOG ─────────────────────────────────────────────────────
section("BLOG  /api/blog")

status, data = request("GET", "/api/blog")
check("GET  /api/blog → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_post = {
    "title": "Test Post",
    "slug": "test-post-abc123",
    "content": "This is test content.",
    "author_id": "test-author",
    "published": False,
    "image": None
}
status, created = request("POST", "/api/blog", new_post)
check("POST /api/blog → 201", status == 201, str(created.get("id", "")))
post_id = created.get("id") if isinstance(created, dict) else None

if post_id:
    status, got = request("GET", f"/api/blog/{post_id}")
    check(f"GET  /api/blog/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/blog/{post_id}", {"published": True})
    check(f"PATCH /api/blog/{{id}} → 200", status == 200, str(patched.get("published", "")))

    status, _ = request("DELETE", f"/api/blog/{post_id}")
    check(f"DELETE /api/blog/{{id}} → 204", status == 204)

# ─── TESTIMONIALS ─────────────────────────────────────────────
section("TESTIMONIALS  /api/testimonials")

status, data = request("GET", "/api/testimonials")
check("GET  /api/testimonials → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

new_testimonial = {
    "text": "Great service!",
    "author": "Test Author",
    "rating": 5.0
}
status, created = request("POST", "/api/testimonials", new_testimonial)
check("POST /api/testimonials → 201", status == 201, str(created.get("id", "")))
test_id = created.get("id") if isinstance(created, dict) else None

if test_id:
    status, got = request("GET", f"/api/testimonials/{test_id}")
    check(f"GET  /api/testimonials/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/testimonials/{test_id}", {"rating": 4.0})
    check(f"PATCH /api/testimonials/{{id}} → 200", status == 200)

    status, _ = request("DELETE", f"/api/testimonials/{test_id}")
    check(f"DELETE /api/testimonials/{{id}} → 204", status == 204)

# ─── INVENTORY ────────────────────────────────────────────────
section("INVENTORY  /api/inventory")

status, data = request("GET", "/api/inventory")
check("GET  /api/inventory → 200", status == 200, f"{len(data)} items" if isinstance(data, list) else str(data))

# Inventory POST requires a valid product_id — create a temp product first
_temp_prod = {
    "image": "https://example.com/tmp.jpg",
    "name": "Temp Inventory Product",
    "category": "Test",
    "price": "$1.00",
    "priceNum": 1.0,
    "description": "Temporary product for inventory test"
}
_, _tmp_created = request("POST", "/api/products", _temp_prod)
_tmp_prod_id = _tmp_created.get("id") if isinstance(_tmp_created, dict) else None

new_inv = {
    "product_id": _tmp_prod_id or "fallback-id",
    "sku": "TEST-SKU-INV-001",
    "stock_qty": 100,
    "reorder_level": 10,
    "supplier": "Test Supplier"
}
status, created = request("POST", "/api/inventory", new_inv)
check("POST /api/inventory → 201", status == 201, str(created.get("id", "")))
inv_id = created.get("id") if isinstance(created, dict) else None

if inv_id:
    status, got = request("GET", f"/api/inventory/{inv_id}")
    check(f"GET  /api/inventory/{{id}} → 200", status == 200)

    status, patched = request("PATCH", f"/api/inventory/{inv_id}", {"stock_qty": 50})
    check(f"PATCH /api/inventory/{{id}} → 200", status == 200, str(patched.get("stock_qty", "")))

    status, _ = request("DELETE", f"/api/inventory/{inv_id}")
    check(f"DELETE /api/inventory/{{id}} → 204", status == 204)

# Clean up the temp product
if _tmp_prod_id:
    request("DELETE", f"/api/products/{_tmp_prod_id}")

# ─── SUMMARY ──────────────────────────────────────────────────
section("SUMMARY")
passed = sum(1 for _, ok in results if ok)
failed = sum(1 for _, ok in results if not ok)
total = len(results)

print(f"\n  Total : {total}")
print(f"  {PASS} Passed : {passed}")
print(f"  {FAIL} Failed : {failed}")
print()

if failed == 0:
    print(f"  {PASS} ALL TESTS PASSED!")
else:
    print(f"  {WARN} {failed} test(s) failed.")
    print("\n  Failed tests:")
    for label, ok in results:
        if not ok:
            print(f"    {FAIL} {label}")

sys.exit(0 if failed == 0 else 1)
