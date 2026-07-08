"""Generate frontend/app/data/_yundar.json from api/nutrition_yundar.py, copy images."""
import json
import os
import shutil
import sys

ROOT = "/DATA3/users/mj/subwayyy"
sys.path.insert(0, ROOT)
from api.nutrition_yundar import yundar_nutrition, yundar_images, yundar_desc  # noqa: E402

SRC_IMG = os.path.join(ROOT, "static/images/yundar")
DST_IMG = os.path.join(ROOT, "frontend/public/yundar")
os.makedirs(DST_IMG, exist_ok=True)

FIELD_MAP = {
    "중량 (g)": "weight",
    "열량 (kcal)": "calories",
    "단백질 (g)": "protein",
    "당류 (g)": "sugar",
    "지방 (g)": "fat",
    "순탄수 (g)": "netCarbs",
    "식이섬유 (g)": "fiber",
}

items = []
copied = 0
for name, nutri in yundar_nutrition.items():
    item = {"name": name}
    if nutri:
        for ko, en in FIELD_MAP.items():
            if ko in nutri:
                item[en] = nutri[ko]
    else:
        # source has no nutrition table for this flavor
        item.update({"weight": 0, "calories": 0, "protein": 0, "sugar": 0,
                     "fat": 0, "netCarbs": 0, "fiber": 0, "noNutrition": True})
    img = yundar_images.get(name)
    if img:
        src = os.path.join(SRC_IMG, img)
        if os.path.exists(src):
            shutil.copyfile(src, os.path.join(DST_IMG, img))
            item["image"] = img
            copied += 1
    desc = (yundar_desc.get(name) or "").strip()
    if desc:
        item["desc"] = desc
    items.append(item)

data = {"samgak": items}
out = os.path.join(ROOT, "frontend/app/data/_yundar.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("items:", len(items))
print("with image:", copied, "| images in public/yundar:", len(os.listdir(DST_IMG)))
print("no-nutrition:", sum(1 for it in items if it.get("noNutrition")))
print("wrote:", out)
print("sample:", json.dumps(items[1], ensure_ascii=False))
