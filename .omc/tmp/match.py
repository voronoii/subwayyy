"""Match vision-read image labels to the 122 extracted flavor names (exact-first)."""
import json
import re
import difflib

IMG_LABELS = {
    16: "오레오 초코 송이 삼각이", 17: "쑥카오 삼각이", 18: "솔티 너티 초코뱅 삼각이",
    19: "퓨어 레몬 삼각이", 20: "아몬드 빼빼로 삼각이", 21: "치즈 호랑이 삼각이",
    22: "코코넛 커피 삼각이", 23: "바닐라 삼각이", 24: "밀크 초코송이 삼각이",
    25: "카카오 마차차 삼각이", 26: "딸기 삼각이", 27: "말차 딸기 (층층) 삼각이",
    28: "단호박 삼각이", 29: "블랙 삼각이", 30: "제주 성읍 호말 삼각이",
    31: "화이트 치즈 팝 삼각이", 32: "미숫가루 라떼 삼각이", 33: "화이트 청크 딸기 삼각이",
    34: "화이트 오레오 삼각이", 35: "민트 초코 삼각이", 36: "로얄 얼그레이 레몬 삼각이",
    37: "고소미 삼각이", 38: "카카오 마차차 삼각이", 39: "쑥 삼각이",
    40: "말차 르뱅 삼각이", 41: "레드벨벳 삼각이", 42: "돼지바 삼각이",
    43: "넛츠 초코칩 삼각이", 44: "(노오밀) 피스타치오 삼각이", 45: "순백의 코코넛 삼각이",
    46: "올리브 치아바타 삼각이", 47: "바닐라 핫케이크 삼각이", 48: "모카 초코칩 (2배) 삼각이",
    49: "말차 초코칩 (2배) 삼각이", 50: "얼그레이 초코칩 (2배) 삼각이", 51: "드롭 더 호지 삼각이",
    52: "완두박 콩고물 삼각이", 53: "하루견과 삼각이", 54: "오사쯔 삼각이",
    55: "꿀 고구마 송이 삼각이", 56: "임자 만난 흑임자 삼각이", 57: "바나나킥 삼각이",
    58: "바닐라 마카다미아 삼각이", 59: "초코에 빠진 딸기 삼각이", 60: "말차나무 초코 숲 삼각이",
    61: "솔티 카카오 삼각이", 62: "모카번 삼각이", 63: "밀크 초코송이 삼각이",
    64: "감자칩 삼각이", 65: "로스팅 호지 피칸 삼각이", 66: "고구마깡 삼각이",
    67: "머그워트 너티뱅 삼각이", 68: "(로즈마리) 허브 크래커 삼각이", 69: "해풍 쑥 인절미 삼각이",
    70: "옥수수 팝콘 삼각이", 71: "치즈번 삼각이", 72: "제주 말차번 삼각이",
    73: "(발로나) 초코번 삼각이", 74: "진정한 타로송이 삼각이", 75: "딸기 품은 딸기 삼각이",
    76: "치즈송이 삼각이", 77: "피스타치오 빼빼로 삼각이", 78: "말차 품은 말차 송이 삼각이",
    79: "쑥 품은 쑥 삼각이", 80: "호지 송이 삼각이", 81: "누텔라 헤이즐넛 삼각이",
    82: "소금 초코 삼각이", 83: "꿀 고구마 퐁당 오사쯔 삼각이", 84: "꿀 고구마 DRZ 오사쯔 삼각이",
    85: "쑥 DRZ 말차 삼각이", 86: "레몬 드리즐 삼각이", 87: "국희 땅콩샌드 드리즐 삼각이",
    88: "쿠앤크 초코송이 삼각이", 89: "바나나 크런치 초코바 삼각이", 90: "피스타치오 크런치 초코바 삼각이",
    91: "딸기 크런치 초코바 삼각이", 92: "말차 크런치 초코바 삼각이", 93: "피넛 크런치 초코바 삼각이",
    94: "(Double) 호지차 크런치 초코바 삼각이", 95: "우베 아박 크런치 초코바 삼각이",
    96: "오리지널 크런치 초코바 삼각이", 97: "에브리띵 피넛송이 삼각이",
    98: "말차 스플래쉬 Deep 블랙 삼각이", 99: "블랙 스플래쉬 말차 삼각이",
    100: "라즈베리 레몬 케이크 삼각이", 101: "ㅋㅋㅇ 라즈베리 드리즐 삼각이",
    102: "라즈베리 레몬 케이크 삼각이", 103: "런던 코코 삼각이", 104: "인절미 팥빙수 삼각이",
    105: "단호박 칸쵸 삼각이",
}

# hand-fixed OCR spelling differences (image label token -> canonical flavor token)
FIX = {
    "노오밀": "노오일",     # #44
    "완두박콩고물": "완두박콩코물",  # #52
}


def norm(s: str) -> str:
    s = re.sub(r"[\U0001F000-\U0001FAFF☀-➿]", "", s)   # emoji
    s = s.replace("삼각이", "")
    s = re.sub(r"[()\[\]!·.,/\-~’'\"]", "", s)
    s = re.sub(r"\s+", "", s)
    for a, b in FIX.items():
        s = s.replace(a, b)
    return s.strip().lower()


data = json.load(open(".omc/tmp/yundar_extract.json", encoding="utf-8"))
flavors = [r["name"] for r in data["flavors"]]
fnorm = {f: norm(f) for f in flavors}

assigned = {}      # flavor -> image idx
used_imgs = set()

# Pass 1: exact normalized match, in flavor order (so canonical dup goes to first flavor)
norm_to_flavors = {}
for f in flavors:
    norm_to_flavors.setdefault(fnorm[f], []).append(f)

for idx in sorted(IMG_LABELS):
    nl = norm(IMG_LABELS[idx])
    cands = norm_to_flavors.get(nl, [])
    for f in cands:
        if f not in assigned:
            assigned[f] = idx
            used_imgs.add(idx)
            break

# Pass 2: fuzzy for images not yet used, against still-unassigned flavors
remaining_imgs = [i for i in sorted(IMG_LABELS) if i not in used_imgs]
for idx in remaining_imgs:
    nl = norm(IMG_LABELS[idx])
    pool = {fnorm[f]: f for f in flavors if f not in assigned}
    close = difflib.get_close_matches(nl, list(pool.keys()), n=1, cutoff=0.72)
    if close:
        f = pool[close[0]]
        assigned[f] = idx
        used_imgs.add(idx)

matched = [f for f in flavors if f in assigned]
unmatched_flavors = [f for f in flavors if f not in assigned]
unused_imgs = [i for i in sorted(IMG_LABELS) if i not in used_imgs]

print(f"맛 {len(flavors)} | 사진 매칭 {len(matched)} | 사진 없음 {len(unmatched_flavors)}")
print(f"미사용 이미지(맛에 못붙음): {[(i, IMG_LABELS[i]) for i in unused_imgs]}")
print("\n=== 스팟체크: 헷갈리던 항목 ===")
for want in ["딸기 삼각이", "딸기 송이 삼각이", "꿀 고구마 DRZ 오사쯔 삼각이", "꿀 고구마 송이 삼각이"]:
    print(f"  {want}  ->  #{assigned.get(want, '없음')}")

out = {"assigned": {f: assigned[f] for f in matched}, "labels": IMG_LABELS}
json.dump(out, open(".omc/tmp/img_match.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("\n사진 없는 맛 수:", len(unmatched_flavors))
