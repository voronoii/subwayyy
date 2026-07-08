"""Parse yundar_nutrition.txt (authoritative) and diff against _yundar.json catalog."""
import json
import re

TXT = "/DATA3/users/mj/subwayyy/frontend/app/data/yundar_missed/yundar_nutrition.txt"
JSON = "/DATA3/users/mj/subwayyy/frontend/app/data/_yundar.json"


def clean(s: str) -> str:
    return s.replace("​", "").replace("﻿", "").replace("\xa0", " ").strip()


def parse_nutri(s: str):
    d = {}
    m = re.search(r"([\d.]+)\s*g\s*당\s*([\d.]+)\s*kcal", s)
    if m:
        d["weight"] = float(m.group(1))
        d["calories"] = float(m.group(2))
    for label, key in [("순탄수", "netCarbs"), ("식이섬유", "fiber"), ("당류", "sugar"),
                       ("지방", "fat"), ("단백질", "protein")]:
        mm = re.search(label + r"\s*([\d.]+)", s)
        if mm:
            d[key] = float(mm.group(1))
    return d


lines = open(TXT, encoding="utf-8").read().splitlines()
products = []
name_buf = []
desc_started = False
for raw in lines:
    s = clean(raw)
    if not s:
        continue
    if re.search(r"\[\s*[\d.]+\s*g\s*당\s*[\d.]+\s*kcal", s):
        name = " ".join(name_buf).strip()
        products.append({"name": name, "nutri": parse_nutri(s)})
        name_buf = []
        desc_started = False
        continue
    if s[0] in "\"“":
        desc_started = True
        continue
    if s.startswith("원재료"):
        desc_started = True
        continue
    if desc_started:
        continue
    name_buf.append(s)

# dedupe by name (keep first)
seen = {}
order = []
for p in products:
    n = p["name"]
    if n not in seen:
        seen[n] = p
        order.append(n)
uniq = [seen[n] for n in order]

print(f"txt 원시 블록: {len(products)} | 고유 제품명: {len(uniq)}")

# load catalog
cat = json.load(open(JSON))["samgak"]
cat_names = {it["name"] for it in cat}


def norm(s):
    s = re.sub(r"[\U0001F000-\U0001FAFF☀-➿]", "", s)
    s = re.sub(r"\s+", "", s)
    return s

cat_norm = {norm(n): n for n in cat_names}
txt_names = [p["name"] for p in uniq]
txt_norm = {norm(n): n for n in txt_names}

# txt에 있는데 카탈로그에 없음 (정규화 기준)
missing = [p for p in uniq if norm(p["name"]) not in cat_norm]
# 카탈로그에 있는데 txt에 없음
extra = [n for n in cat_names if norm(n) not in txt_norm]

print(f"\n=== [A] txt에 있으나 카탈로그에 없음: {len(missing)}종 ===")
for p in missing:
    n = p["nutri"]
    print(f"  + {p['name']}  ({n.get('calories','?')}kcal, {n.get('weight','?')}g)")

print(f"\n=== [B] 카탈로그에 있으나 txt에 없음(이름 불일치/삭제?): {len(extra)}종 ===")
for n in sorted(extra):
    print(f"  - {n}")

json.dump(uniq, open("/DATA3/users/mj/subwayyy/.omc/tmp/txt_products.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
