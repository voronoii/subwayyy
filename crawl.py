# subway_kr_nutrition_scraper.py
import re, time, json, math, pathlib
import pandas as pd
from playwright.sync_api import sync_playwright

BASE = "https://www.subway.co.kr"

CATEGORY_LIST = {
    "sandwich": f"{BASE}/menuList/sandwich",
    "unit":     f"{BASE}/menuList/unit",      # 랩·기타
    "salad":    f"{BASE}/menuList/salad",
    "morning":  f"{BASE}/menuList/morning",
}

# 상세 페이지 URL 패턴: /menuView/<category>?menuItemIdx=####
DETAIL_PREFIXES = ("menuView/sandwich", "menuView/unit", "menuView/salad", "menuView/morning")

def clean_text(t): 
    return re.sub(r"\s+", " ", t).strip()

def parse_numbers(block_text):
    # "중량(g) 열량(kcal) 단백질(g) 포화지방(g) 당류(g) 나트륨(mg)"
    # 예: "182 300 15.9 (29%) 3.7 (25%) 7.9 (8%) 666 (33%)"
    nums = re.findall(r"[\d.]+", block_text)
    # 기대 순서: weight, kcal, protein, sat_fat, sugars, sodium
    if len(nums) >= 6:
        w, kcal, pro, sat, sug, sodium = nums[:6]
        return dict(weight_g=float(w), kcal=float(kcal),
                    protein_g=float(pro), saturated_fat_g=float(sat),
                    sugars_g=float(sug), sodium_mg=float(sodium))
    return {}

def scrape_menu_items(page, list_url, category_key):
    page.goto(list_url, wait_until="networkidle")
    time.sleep(0.5)

    # 리스트 페이지에서 상세 링크 추출
    # a[href*='menuView/'] 를 모두 수집 (이미지/텍스트 둘 다 대응)
    links = set()
    for a in page.locator("a").all():
        href = a.get_attribute("href") or ""
        if any(pref in href for pref in DETAIL_PREFIXES):
            links.add(href if href.startswith("http") else BASE + href)
    # 무한스크롤/탭형 UI 대비: 현재 보이는 탭 외 항목도 종종 DOM에 있음
    return [{"category": category_key, "url": u} for u in sorted(links)]

def scrape_detail(page, url):
    page.goto(url, wait_until="networkidle")
    time.sleep(0.3)

    title_ko = clean_text(page.locator("h2, h3").nth(0).inner_text())  # 상단 한글명
    # 영문명이 바로 뒤나 옆에 붙어있는 패턴이 많음 → 페이지 전체 텍스트에서 보조 추출
    fulltext = page.locator("body").inner_text()
    # 영양성분표 블록
    nutr_header = page.get_by_text("영양성분표", exact=False)
    data = {}
    if nutr_header.count() > 0:
        # 헤더 다음에 나오는 표/한 줄 텍스트를 긁어옴
        # 1) 표 셀 텍스트
        tbl = nutr_header.locator("xpath=following::*[1]")
        block = tbl.inner_text()
        data = parse_numbers(block)

    # 고지문(기준/제외사항)
    notes = []
    for p in page.locator("text=※").all():
        notes.append(clean_text(p.inner_text()))
    notes = list(dict.fromkeys(notes))  # 중복 제거

    # 카테고리 추출(경로 일부)
    m = re.search(r"/menuView/([a-z]+)\?", url)
    category = m.group(1) if m else ""

    return {
        "category": category,
        "name_ko": title_ko,
        "name_en": "",  # 필요 시 추가 파싱
        "source_url": url,
        "notes": " | ".join(notes),
        **data
    }

def scrape_fresh_popup(page):
    # 빵/치즈/소스 영양 성분표(팝업)
    url = f"{BASE}/freshNutritionFacts"
    page.goto(url, wait_until="networkidle")
    txt = clean_text(page.locator("body").inner_text())

    rows = []
    # "항목 중량 (g) 열량 (kcal) 단백질 (g) 포화지방 (g) 당류 (g) 나트륨 (mg)"
    pat = re.compile(
        r"([가-힣A-Za-z .\-()]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\([\d%]+\)\s+([\d.]+)\s*\([\d%]+\)\s+([\d.]+)\s*\([\d%]+\)\s+([\d.]+)\s*\([\d%]+\)"
    )
    for name, w, kcal, pro, sat, sug, na in pat.findall(txt):
        rows.append({
            "group": "bread/cheese/sauce",
            "item": name.strip(),
            "weight_g": float(w),
            "kcal": float(kcal),
            "protein_g": float(pro),
            "saturated_fat_g": float(sat),
            "sugars_g": float(sug),
            "sodium_mg": float(na),
            "source_url": url
        })
    return rows

def scrape_all():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1) 카테고리별 상품 링크 수집
        links = []
        for ck, url in CATEGORY_LIST.items():
            try:
                links += scrape_menu_items(page, url, ck)
            except Exception as e:
                print(f"[WARN] 리스트 수집 실패 {ck}: {e}")

        links = sorted({d["url"] for d in links})
        print(f"총 상세 링크: {len(links)}개")

        # 2) 상세 페이지 파싱
        items = []
        for i, url in enumerate(links, 1):
            try:
                it = scrape_detail(page, url)
                items.append(it)
            except Exception as e:
                print(f"[WARN] 상세 실패 {url}: {e}")
        browser.close()

    df_menu = pd.DataFrame(items)
    # 3) 재료 팝업
    fresh_rows = []
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            fresh_rows = scrape_fresh_popup(page)
            browser.close()
    except Exception as e:
        print(f"[WARN] 재료 팝업 실패: {e}")
    df_fresh = pd.DataFrame(fresh_rows)

    # 4) 저장
    outdir = pathlib.Path("output"); outdir.mkdir(exist_ok=True)
    df_menu.to_csv(outdir / "subway_menu_nutrition.csv", index=False, encoding="utf-8-sig")
    df_fresh.to_csv(outdir / "subway_ingredients_nutrition.csv", index=False, encoding="utf-8-sig")

    with pd.ExcelWriter(outdir / "subway_nutrition_all.xlsx", engine="openpyxl") as xw:
        df_menu.to_excel(xw, index=False, sheet_name="menus")
        df_fresh.to_excel(xw, index=False, sheet_name="ingredients")

if __name__ == "__main__":
    scrape_all()
