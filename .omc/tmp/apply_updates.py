"""Apply all catalog updates: 7 new 삼각이, name fix, nutrition fill, + 3 new categories."""
import json
import os
import re
import shutil

ROOT = "/DATA3/users/mj/subwayyy"
DATA = f"{ROOT}/frontend/app/data/_yundar.json"
IMGSRC = f"{ROOT}/.omc/tmp/yundar_imgs"
IMGDST = f"{ROOT}/frontend/public/yundar"
parsed = json.load(open(f"{ROOT}/.omc/tmp/txt_parsed.json"))


def declean(name):
    m = re.search(r"([가-힣A-Za-z0-9()+·♥ㄱ-ㅎ]+(?: [가-힣A-Za-z0-9()+·♥ㄱ-ㅎ!]+){0,5} ?삼각이)\s*$", name)
    if m and any(t in name for t in ("니다", "😊", "제작", "부탁", "안내")):
        return m.group(1).strip()
    return re.sub(r"\s+", " ", name).strip()


def rn(x):
    x = re.sub(r"[\U0001F000-\U0001FAFF☀-➿]", "", x)
    return re.sub(r"[^가-힣0-9A-Za-z]", "", x)


# robust-normalized name -> nutrition, from full txt parse
txt_nutri_raw = {}
for p in parsed["all"]:
    k = rn(p["name"])
    if k not in txt_nutri_raw:
        txt_nutri_raw[k] = p["nutri"]


class _Lookup:
    def __getitem__(self, name):
        return txt_nutri_raw[rn(name)]

    def __contains__(self, name):
        return rn(name) in txt_nutri_raw


txt_nutri = _Lookup()

data = json.load(open(DATA))
sam = data["samgak"]

# image copy helper -> returns new filename
_counter = [125]
def copy_img(srcfile):
    _counter[0] += 1
    fn = f"y{_counter[0]:03d}.jpg"
    shutil.copyfile(os.path.join(IMGSRC, srcfile), os.path.join(IMGDST, fn))
    return fn

PHOTO = {
    "꿀 고구마 퐁당 오사쯔 삼각이": "0083.jpg",
    "말차 스플래쉬 Deep 블랙 삼각이": "0098.jpg",
    "ㅋㅋㅇ 라즈베리 드리즐 삼각이": "0101.jpg",
    "(더블) 호지차 크런치 초코바 삼각이": "0094.jpg",
    "라즈베리 레몬 케이크 (드리즐) 삼각이": "0100.jpg",
}

def make_item(name):
    n = txt_nutri[name]
    it = {"name": name,
          "weight": n["weight"], "calories": n["calories"], "protein": n["protein"],
          "sugar": n["sugar"], "fat": n["fat"], "netCarbs": n["netCarbs"], "fiber": n["fiber"]}
    if "sodium" in n:
        it["sodium"] = n["sodium"]
    if name in PHOTO:
        it["image"] = copy_img(PHOTO[name])
    return it

# --- 1. Fix (드리즐) → 라즈베리 레몬 케이크 (드리즐) + photo + refresh nutrition ---
for it in sam:
    if it["name"] == "(드리즐) 삼각이":
        it["name"] = "라즈베리 레몬 케이크 (드리즐) 삼각이"
        n = txt_nutri["라즈베리 레몬 케이크 (드리즐) 삼각이"]
        it.update({"weight": n["weight"], "calories": n["calories"], "protein": n["protein"],
                   "sugar": n["sugar"], "fat": n["fat"], "netCarbs": n["netCarbs"], "fiber": n["fiber"]})
        it.pop("noNutrition", None)
        if not it.get("image"):
            it["image"] = copy_img(PHOTO["라즈베리 레몬 케이크 (드리즐) 삼각이"])
        print("이름수정:", it["name"], "→", it.get("image"))

# --- 2. Fill 딸기 말차 (층층) nutrition ---
for it in sam:
    if it["name"] == "딸기 말차 (층층) 삼각이":
        n = txt_nutri["딸기 말차 (층층) 삼각이"]
        it.update({"weight": n["weight"], "calories": n["calories"], "protein": n["protein"],
                   "sugar": n["sugar"], "fat": n["fat"], "netCarbs": n["netCarbs"], "fiber": n["fiber"]})
        it.pop("noNutrition", None)
        print("영양채움:", it["name"], f"{n['calories']}kcal")

# --- 3. Add 7 new 삼각이 ---
NEW = ["말차 스플래쉬 Deep 블랙 삼각이", "(더블) 딸기 크런치 초코바 삼각이",
       "(더블) 말차 크런치 초코바 삼각이", "(더블) 호지차 크런치 초코바 삼각이",
       "(더블) 뽀또 크런치 초코바 삼각이", "꿀 고구마 퐁당 오사쯔 삼각이",
       "ㅋㅋㅇ 라즈베리 드리즐 삼각이"]
exist = {it["name"] for it in sam}
for nm in NEW:
    if nm in exist:
        print("이미존재 skip:", nm); continue
    it = make_item(nm)
    sam.append(it)
    print("추가(삼각이):", nm, f"{it['calories']}kcal", it.get("image", "사진없음"))

# --- 4. New categories ---
def build_cat(items):
    out = []
    for p in items:
        n = p["nutri"]
        it = {"name": re.sub(r"\s+", " ", p["name"]).strip()}
        for k in ["weight", "calories", "protein", "sugar", "fat", "netCarbs", "fiber", "sodium"]:
            if k in n:
                it[k] = n[k]
        out.append(it)
    return out

data["creambread"] = build_cat(parsed["creambread"])
data["banryeobbang"] = build_cat(parsed["banryeobbang"])
data["samdu"] = build_cat(parsed["samdu"])

json.dump(data, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

print("\n=== 최종 ===")
print("삼각이:", len(data["samgak"]), "| 크림빵:", len(data["creambread"]),
      "| 반려빵:", len(data["banryeobbang"]), "| 삼두과자:", len(data["samdu"]))
print("영양준비중:", sum(1 for it in data["samgak"] if it.get("noNutrition")))
print("public/yundar 이미지:", len(os.listdir(IMGDST)))
