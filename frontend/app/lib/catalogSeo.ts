import type { MenuItem } from "../data/types";

export interface CatalogStats {
  count: number;
  withNutrition: number;
  photoCount: number;
  kcalMin: number;
  kcalMax: number;
  kcalAvg: number;
  lowKcalName: string;
  highKcalName: string;
  proteinMin: number;
  proteinMax: number;
  highProteinName: string;
  fiberMin: number;
  fiberMax: number;
  sugarMin: number;
  sugarMax: number;
}

export interface Faq {
  q: string;
  a: string;
}

function round(n: number): number {
  return Math.round(n);
}

export function catalogStats(items: MenuItem[]): CatalogStats {
  const nut = items.filter((it) => !it.noNutrition);
  const by = (sel: (it: MenuItem) => number, dir: "min" | "max"): MenuItem =>
    nut.reduce((best, it) => {
      const a = sel(it);
      const b = sel(best);
      return (dir === "min" ? a < b : a > b) ? it : best;
    }, nut[0]);

  const kcals = nut.map((it) => it.calories);
  const proteins = nut.map((it) => it.protein);
  const fibers = nut.map((it) => it.fiber ?? 0);
  const sugars = nut.map((it) => it.sugar);
  const lowKcal = by((it) => it.calories, "min");
  const highKcal = by((it) => it.calories, "max");
  const highProtein = by((it) => it.protein, "max");

  return {
    count: items.length,
    withNutrition: nut.length,
    photoCount: items.filter((it) => it.image).length,
    kcalMin: Math.min(...kcals),
    kcalMax: Math.max(...kcals),
    kcalAvg: round(kcals.reduce((a, b) => a + b, 0) / kcals.length),
    lowKcalName: lowKcal.name,
    highKcalName: highKcal.name,
    proteinMin: Math.min(...proteins),
    proteinMax: Math.max(...proteins),
    highProteinName: highProtein.name,
    fiberMin: Math.min(...fibers),
    fiberMax: Math.max(...fibers),
    sugarMin: Math.min(...sugars),
    sugarMax: Math.max(...sugars),
  };
}

/**
 * FAQ used BOTH as visible on-page content and as FAQPage JSON-LD.
 * Google requires FAQPage answers to be visible on the page, so keep these in sync.
 * Wording targets queries like "윤달베이커리 영양성분", "윤달 삼각이 칼로리", "윤달 스콘 영양성분".
 */
export function catalogFaqs(brandName: string, s: CatalogStats): Faq[] {
  return [
    {
      q: `${brandName} 삼각이 칼로리는 얼마인가요?`,
      a: `${brandName} 삼각이(통밀 스콘)는 맛에 따라 개당 약 ${s.kcalMin}~${s.kcalMax}kcal이며 평균은 약 ${s.kcalAvg}kcal입니다. 칼로리가 가장 낮은 맛은 ${s.lowKcalName}(${s.kcalMin}kcal), 가장 높은 맛은 ${s.highKcalName}(${s.kcalMax}kcal)입니다. 맛별 정확한 칼로리는 위 도감에서 확인할 수 있습니다.`,
    },
    {
      q: `${brandName} 삼각이 영양성분(단백질·식이섬유·당류)은 어떻게 되나요?`,
      a: `${brandName} 삼각이는 비정제 통밀과 현미로 만들어 개당 식이섬유가 약 ${s.fiberMin}~${s.fiberMax}g, 단백질이 약 ${s.proteinMin}~${s.proteinMax}g입니다. 설탕 대신 알룰로스·마스코바도 등 천연 대체당을 사용해 당류가 약 ${s.sugarMin}~${s.sugarMax}g으로 낮은 편입니다. 각 맛의 열량·단백질·식이섬유·당류·지방·순탄수는 제품을 선택하면 상세히 볼 수 있습니다.`,
    },
    {
      q: `칼로리가 가장 낮은 ${brandName} 스콘은 무엇인가요?`,
      a: `현재 기준 칼로리가 가장 낮은 ${brandName} 삼각이는 ${s.lowKcalName}로 약 ${s.kcalMin}kcal입니다. 단백질이 가장 높은 맛은 ${s.highProteinName}(약 ${s.proteinMax}g)입니다. 다이어트 중이라면 위 도감의 정렬·검색으로 저칼로리·고단백 맛을 찾아보세요.`,
    },
    {
      q: `${brandName} 삼각이는 다이어트나 식사대용으로 괜찮나요?`,
      a: `${brandName} 삼각이는 통밀·현미 기반의 저당·고식이섬유 비건 스콘으로, 식사대용 식단빵이나 다이어트 간식으로 많이 찾습니다. 다만 맛에 따라 칼로리·당류 차이가 크므로, 목표에 맞는 맛을 위 ${s.count}종 도감에서 비교해 선택하는 것을 권장합니다.`,
    },
  ];
}
