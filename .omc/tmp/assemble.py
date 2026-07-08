"""Assemble final yundar dataset: nutrition + image, copy images, emit nutrition_yundar.py."""
import json
import os
import shutil

ROOT = "/DATA3/users/mj/subwayyy"
IMG_SRC = os.path.join(ROOT, ".omc/tmp/yundar_imgs")
STATIC_DST = os.path.join(ROOT, "static/images/yundar")
os.makedirs(STATIC_DST, exist_ok=True)

data = json.load(open(os.path.join(ROOT, ".omc/tmp/yundar_extract.json"), encoding="utf-8"))
match = json.load(open(os.path.join(ROOT, ".omc/tmp/img_match.json"), encoding="utf-8"))
assigned = dict(match["assigned"])           # flavor -> image idx

# manual overrides for leftover-but-correct photos (word-order / naming diffs)
assigned.setdefault("딸기 말차 (층층) 삼각이", 27)
assigned.setdefault("노오란 단호박 삼각이", 28)

FIELDS = ["중량 (g)", "열량 (kcal)", "순탄수 (g)", "식이섬유 (g)", "당류 (g)", "지방 (g)", "단백질 (g)"]

flavors = data["flavors"]
records = []
for i, r in enumerate(flavors, 1):
    name = r["name"]
    idx = assigned.get(name)
    img_name = None
    if idx is not None:
        src = os.path.join(IMG_SRC, f"{idx:04d}.jpg")
        if os.path.exists(src):
            img_name = f"y{i:03d}.jpg"
            shutil.copyfile(src, os.path.join(STATIC_DST, img_name))
    records.append({"name": name, "nutri": r["nutri"], "desc": r["desc"], "image": img_name})

with_img = sum(1 for r in records if r["image"])
with_nut = sum(1 for r in records if r["nutri"])
print(f"총 {len(records)}종 | 영양 {with_nut} | 사진 {with_img}")
print(f"이미지 복사 대상: {STATIC_DST} ({len(os.listdir(STATIC_DST))} files)")


def fmt_num(v):
    if v == int(v):
        return str(int(v))
    return str(v)


# emit nutrition_yundar.py
lines = []
lines.append("# nutrition_yundar.py")
lines.append("# 윤달베이커리 '삼각이' 통밀스콘 라인업 — smartstore.naver.com/yunder 제품 상세에서 추출")
lines.append("# 영양성분: 90g 완제품이 아닌 제품 상세 표기값(중량 g당) 기준. 나트륨/포화지방은 원자료 미표기.")
lines.append("")
lines.append("# 맛 이름 -> 영양성분 (subway nutrition_data.py 와 동일한 dict 구조)")
lines.append("yundar_nutrition = {")
for r in records:
    n = r["nutri"] or {}
    parts = []
    for f in FIELDS:
        if f in n:
            parts.append(f"'{f}': {fmt_num(n[f])}")
    lines.append(f"    {r['name']!r}: {{{', '.join(parts)}}},")
lines.append("}")
lines.append("")
lines.append("# 맛 이름 -> 제품 사진 파일명 (static/images/yundar/). 사진 없으면 None")
lines.append("yundar_images = {")
for r in records:
    lines.append(f"    {r['name']!r}: {r['image']!r},")
lines.append("}")
lines.append("")
lines.append("# 맛 이름 -> 제품 설명(마케팅 카피, 상세페이지 추출)")
lines.append("yundar_desc = {")
for r in records:
    d = (r["desc"] or "").strip()
    lines.append(f"    {r['name']!r}: {d!r},")
lines.append("}")
lines.append("")

out_path = os.path.join(ROOT, "api/nutrition_yundar.py")
open(out_path, "w", encoding="utf-8").write("\n".join(lines))
print("작성:", out_path)
# sanity: import check
import importlib.util
spec = importlib.util.spec_from_file_location("ny", out_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
print("import OK | nutrition:", len(mod.yundar_nutrition), "| images:", sum(1 for v in mod.yundar_images.values() if v))
