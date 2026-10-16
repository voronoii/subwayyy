import type { Metadata } from "next";
import type { BrandConfig, MenuItem } from "../data/types";

// 본문·검색 정보의 실제 수정일. 영양자료 검증일이나 빌드 날짜가 아니다.
export const CALCULATOR_CONTENT_UPDATED_AT = "2026-10-16";

const SEO: Record<string, { title: string; description: string }> = {
  subway: {
    title: "서브웨이 칼로리 계산기 — 샌드위치 조합별 영양성분",
    description: "서브웨이 샌드위치·빵·치즈·소스·토핑 조합의 칼로리를 계산하세요. 메뉴별 열량, 단백질, 당류, 나트륨과 빵·소스를 더하는 계산 기준을 확인할 수 있습니다.",
  },
  salady: {
    title: "샐러디 칼로리 계산기 — 샐러드·랩 조합별 영양성분",
    description: "샐러디 샐러드·포케볼·랩·드레싱의 칼로리를 조합별로 계산하세요. 전체 메뉴의 열량, 탄수화물, 단백질, 당류와 나트륨을 확인할 수 있습니다.",
  },
  poke: {
    title: "포케올데이 칼로리 계산기 — 포케 조합별 영양성분",
    description: "포케올데이 메뉴·베이스·토핑·소스의 칼로리를 조합별로 계산하세요. 전체 메뉴의 열량, 탄수화물, 단백질, 당류와 나트륨을 확인할 수 있습니다.",
  },
  yundar: {
    title: "윤달베이커리 주간 판매 메뉴·칼로리·영양성분",
    description: "매주 갱신하는 윤달베이커리 판매목록과 삼각이·크림빵·찹싸링 등 제품별 칼로리·단백질·식이섬유·당류를 확인하세요.",
  },
};

export function calculatorContentUpdatedAt(config: BrandConfig): string {
  const weeklyDate = config.weekly?.updatedAt;
  return weeklyDate && /^\d{4}-\d{2}-\d{2}$/.test(weeklyDate) && weeklyDate > CALCULATOR_CONTENT_UPDATED_AT
    ? weeklyDate
    : CALCULATOR_CONTENT_UPDATED_AT;
}

export function calculatorMetadata(config: BrandConfig): Metadata {
  const { title, description: baseDescription } = SEO[config.id];
  const weekly = config.weekly;
  const description = config.id === "yundar" && weekly
    ? `${baseDescription} ${weekly.weekLabel} 판매목록 ${weekly.available.length}종, ${weekly.updatedAt} 확인·반영 기준입니다.`
    : baseDescription;
  const url = `/calculator/${config.id}`;
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "subwayyy.kr", locale: "ko_KR", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function nutritionStructuredData(item: MenuItem) {
  // 다른 제품을 근거로 한 추정치를 확정된 영양성분으로 전달하지 않는다.
  if (item.noNutrition || item.nutritionNote) return undefined;
  const result: Record<string, string> = { "@type": "NutritionInformation" };
  const fields = {
    calories: ["calories", "kcal"], protein: ["proteinContent", "g"],
    sugar: ["sugarContent", "g"], fat: ["fatContent", "g"],
    saturatedFat: ["saturatedFatContent", "g"], fiber: ["fiberContent", "g"],
    carbs: ["carbohydrateContent", "g"], sodium: ["sodiumContent", "mg"],
    weight: ["servingSize", "g"],
  } as const;
  for (const [key, [property, unit]] of Object.entries(fields)) {
    const value = item[key as keyof MenuItem];
    if (typeof value === "number" && Number.isFinite(value)) result[property] = `${value} ${unit}`;
  }
  return Object.keys(result).length > 1 ? result : undefined;
}

export function calculatorStructuredData(config: BrandConfig) {
  const url = `https://subwayyy.kr/calculator/${config.id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url,
        name: SEO[config.id].title, inLanguage: "ko-KR",
        dateModified: calculatorContentUpdatedAt(config),
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "subwayyy.kr", item: "https://subwayyy.kr" },
          { "@type": "ListItem", position: 2, name: SEO[config.id].title, item: url },
        ],
      },
      {
        "@type": "ItemList", name: `${config.name} 메뉴 칼로리·영양성분`,
        numberOfItems: config.categories.reduce((sum, category) => sum + category.items.length, 0),
        itemListElement: config.categories.flatMap((category) => category.items).map((item, index) => {
          const nutrition = nutritionStructuredData(item);
          return {
            "@type": "ListItem", position: index + 1,
            item: {
              "@type": "MenuItem", name: item.name,
              ...(item.nutritionNote ? { description: item.nutritionNote } : {}),
              ...(nutrition ? { nutrition } : {}),
            },
          };
        }),
      },
    ],
  };
}
