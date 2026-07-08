"""Parse yundar_nutrition.txt v2 — clean names, handle 크림빵 2-line nutrition, categorize, diff."""
import json
import re

TXT = "/DATA3/users/mj/subwayyy/frontend/app/data/yundar_missed/yundar_nutrition.txt"
JSONF = "/DATA3/users/mj/subwayyy/frontend/app/data/_yundar.json"


def clean(s):
    return s.replace("​", "").replace("﻿", "").replace("\xa0", " ").strip()


def parse_nutri(s):
    d = {}
    m = re.search(r"([\d.]+)\s*g\s*당\s*([\d.]+)\s*kcal", s)
    if m:
        d["weight"] = float(m.group(1)); d["calories"] = float(m.group(2))
    for label, key in [("순탄수", "netCarbs"), ("식이섬유", "fiber"), ("당류", "sugar"),
                       ("지방", "fat"), ("단백질", "protein"), ("나트륨", "sodium")]:
        mm = re.search(label + r"\s*([\d.]+)", s)
        if mm:
            d[key] = float(mm.group(1))
    return d


SUFFIXES = ["삼각이", "삼두과자", "크림빵", "반려빵", "단팥빵"]
NAME_RE = re.compile(r"([가-힣A-Za-z0-9()+·♥ㄱ-ㅎ ]{2,32}(?:" + "|".join(SUFFIXES) + r"))\s*$")


def extract_name(buf_text):
    """Grab the trailing product name (strips preceding note paragraphs)."""
    # 크림빵 names look like '통곡물 저당 크림빵 바닐라 우유' — suffix 크림빵 then flavor after.
    m = re.search(r"(통곡물 저당 크림빵[가-힣A-Za-z ]{1,20})\s*$", buf_text)
    if m:
        return m.group(1).strip()
    m = NAME_RE.search(buf_text)
    if m:
        return m.group(1).strip()
    return buf_text.strip()[-40:]


lines = open(TXT, encoding="utf-8").read().splitlines()
# collapse blanks, keep order
seq = [clean(x) for x in lines]
seq = [x for x in seq if x]

products = []
buf = []
i = 0
while i < len(seq):
    s = seq[i]
    if re.search(r"\[\s*[\d.]+\s*g\s*당\s*[\d.]+\s*kcal", s):
        nutri_line = s
        # 크림빵: 지방/단백질/나트륨 이 다음 줄에 있으면 합침
        if i + 1 < len(seq) and re.search(r"나트륨|지방.*단백질", seq[i + 1]) and "당" not in seq[i + 1]:
            nutri_line += " " + seq[i + 1]
            i += 1
        name = extract_name(" ".join(buf))
        products.append({"name": name, "nutri": parse_nutri(nutri_line), "raw_buf": " ".join(buf)[-60:]})
        buf = []
    elif s[0] in "\"“" or s.startswith("원재료"):
        # description / ingredients start — stop name accumulation for this block
        buf.append("\x00")  # marker: everything after is not name (we take trailing before marker)
    else:
        # only keep as potential name if we haven't hit a description marker yet in this block
        if "\x00" not in buf:
            buf.append(s)
    i += 1

# dedupe
seen = {}
order = []
for p in products:
    n = p["name"]
    if n and n not in seen:
        seen[n] = p; order.append(n)
uniq = [seen[n] for n in order]

# categorize
def cat_of(n):
    for suf in ["삼각이", "삼두과자", "크림빵", "반려빵", "단팥빵"]:
        if suf in n:
            return suf
    return "기타"

from collections import defaultdict
groups = defaultdict(list)
for p in uniq:
    groups[cat_of(p["name"])].append(p)

print(f"고유 제품: {len(uniq)}")
for g in ["삼각이", "크림빵", "반려빵", "단팥빵", "삼두과자", "기타"]:
    print(f"  {g}: {len(groups[g])}")

# diff 삼각이 vs catalog
cat = json.load(open(JSONF))["samgak"]
def norm(x): return re.sub(r"[\U0001F000-\U0001FAFF☀-➿\s]", "", x)
cat_norm = {norm(it["name"]) for it in cat}
sam_txt = groups["삼각이"]
missing_sam = [p for p in sam_txt if norm(p["name"]) not in cat_norm]

print(f"\n=== 삼각이: txt {len(sam_txt)}종 / 카탈로그에 없는 것 {len(missing_sam)}종 ===")
for p in missing_sam:
    n = p["nutri"]
    print(f"  + {p['name']}  ({n.get('calories','?')}kcal/{n.get('weight','?')}g)")

json.dump({"all": uniq, "missing_samgak": missing_sam,
           "creambread": [p for p in groups['크림빵']],
           "banryeobbang": [p for p in groups['반려빵']+groups['단팥빵']],
           "samdu": [p for p in groups['삼두과자']]},
          open("/DATA3/users/mj/subwayyy/.omc/tmp/txt_parsed.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
