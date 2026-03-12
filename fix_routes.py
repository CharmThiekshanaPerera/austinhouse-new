import os
import glob

files = glob.glob("backend/app/routes/*.py")
print(f"Found {len(files)} route files.")

fixed = 0
for f in files:
    with open(f, "r", encoding="utf-8") as file:
        content = file.read()
        
    old_str = 'doc["id"] = doc.pop("_id")'
    new_str = 'doc["id"] = str(doc.pop("_id"))'
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(f, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"Patched {f}")
        fixed += 1

print(f"Patched {fixed} files.")
