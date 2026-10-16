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
  const fibers = nut.flatMap((it) => typeof it.fiber === "number" ? [it.fiber] : []);
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
 * 제품별 등록 자료를 요약하는 화면 안내. 성분·식단 적합성을 일괄 단정하지 않는다.
 */
export function catalogFaqs(brandName: string, s: CatalogStats): Faq[] {
  return [
    {
      q: `${brandName} 삼각이 칼로리는 얼마인가요?`,
      a: `등록된 ${brandName} 삼각이는 제품별로 개당 약 ${s.kcalMin}~${s.kcalMax}kcal이며 평균은 약 ${s.kcalAvg}kcal입니다. 등록 자료에서 칼로리가 가장 낮은 제품은 ${s.lowKcalName}(${s.kcalMin}kcal), 가장 높은 제품은 ${s.highKcalName}(${s.kcalMax}kcal)입니다. 전체 영양성분 표에서 제품별 수치와 추정값 표시를 함께 확인하세요.`,
    },
    {
      q: `${brandName} 삼각이 영양성분(단백질·식이섬유·당류)은 어떻게 되나요?`,
      a: `등록 자료에서 ${brandName} 삼각이의 개당 단백질은 약 ${s.proteinMin}~${s.proteinMax}g, 식이섬유는 약 ${s.fiberMin}~${s.fiberMax}g, 당류는 약 ${s.sugarMin}~${s.sugarMax}g입니다. 원재료와 영양성분은 제품마다 다르므로 전체 영양성분 표와 제품 상세를 확인하세요. 순탄수는 총 탄수화물과 구분해 표시합니다.`,
    },
    {
      q: `칼로리가 가장 낮은 ${brandName} 스콘은 무엇인가요?`,
      a: `등록 자료에서 칼로리가 가장 낮은 ${brandName} 삼각이는 ${s.lowKcalName}로 약 ${s.kcalMin}kcal입니다. 단백질이 가장 높은 제품은 ${s.highProteinName}(약 ${s.proteinMax}g)입니다. 전체 목록과 이번 회차 판매목록을 함께 살펴보세요.`,
    },
    {
      q: `${brandName}의 이번 회차 판매 제품은 어디에서 확인하나요?`,
      a: `이 페이지의 주간 판매목록에서 확인·반영일과 해당 회차 제품을 볼 수 있습니다. 전체 제품 목록에는 이번 판매목록에 없는 제품도 포함됩니다. 실제 판매 여부와 품절 상태는 공식 판매처에서 확인하세요.`,
    },
  ];
}
