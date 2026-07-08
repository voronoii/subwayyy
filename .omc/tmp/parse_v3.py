"""Final clean diff: txt vs catalog."""
import json
import re

parsed = json.load(open("/DATA3/users/mj/subwayyy/.omc/tmp/txt_parsed.json"))
cat = json.load(open("/DATA3/users/mj/subwayyy/frontend/app/data/_yundar.json"))["samgak"]


def declean(name):
    """strip leading note paragraph if name got polluted."""
    # keep trailing '... 삼각이' after last sentence end / emoji
    m = re.search(r"([가-힣A-Za-z0-9()+·♥ㄱ-ㅎ]+(?: [가-힣A-Za-z0-9()+·♥ㄱ-ㅎ!]+){0,4} 삼각이)\s*$", name)
    if m and ("니다" in name or "😊" in name or "제작" in name or "." in name):
        return m.group(1).strip()
    return re.sub(r"\s+", " ", name).strip()


def norm(x):
    x = re.sub(r"[\U0001F000-\U0001FAFF☀-➿]", "", x)
    return re.sub(r"\s+", "", x)


cat_norm = {norm(it["name"]) for it in cat}

sam = [p for p in parsed["all"] if "삼각이" in p["name"]]
for p in sam:
    p["name"] = declean(p["name"])

missing = [p for p in sam if norm(p["name"]) not in cat_norm]
present = [p for p in sam if norm(p["name"]) in cat_norm]

print(f"txt 삼각이: {len(sam)} | 카탈로그에 이미 있음: {len(present)} | 빠짐: {len(missing)}")
print("\n=== 카탈로그에 없는 삼각이 ===")
for p in missing:
    n = p["nutri"]
    print(f"  + {p['name']}  ({n.get('calories','?')}kcal/{int(n.get('weight',0))}g, 단백질 {n.get('protein','?')} 식이섬유 {n.get('fiber','?')} 당류 {n.get('sugar','?')} 지방 {n.get('fat','?')} 순탄수 {n.get('netCarbs','?')})")

# 카탈로그에만 있고 txt엔 없는 것
txt_norm = {norm(p["name"]) for p in sam}
onlycat = [it["name"] for it in cat if norm(it["name"]) not in txt_norm]
print(f"\n=== 카탈로그에만 있음(내가 추가했거나 이름다름): {len(onlycat)} ===")
for n in onlycat:
    print("  -", n)

print("\n=== 삼각이 외 라인(카탈로그에 아예 없음) ===")
for label, key in [("크림빵", "creambread"), ("반려빵/단팥빵", "banryeobbang"), ("삼두과자", "samdu")]:
    print(f"\n  [{label}] {len(parsed[key])}종")
    for p in parsed[key]:
        n = p["nutri"]
        print(f"    · {p['name']}  ({n.get('calories','?')}kcal/{int(n.get('weight',0))}g, 나트륨 {n.get('sodium','-')}mg)")

json.dump({"missing_samgak": missing, "onlycat": onlycat}, open("/DATA3/users/mj/subwayyy/.omc/tmp/final_missing.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
