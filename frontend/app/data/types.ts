export interface MenuItem {
  name: string;
  calories: number;
  protein: number;
  saturatedFat?: number;
  sugar: number;
  sodium?: number;
  weight?: number;
  carbs?: number;
  fat?: number;
  // catalog-brand extras (e.g. 윤달베이커리 삼각이)
  netCarbs?: number;
  fiber?: number;
  image?: string;
  desc?: string;
  noNutrition?: boolean;
  // shown in the product modal when nutrition is estimated from another item
  nutritionNote?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
}

export interface NutritionKey {
  key: keyof MenuItem;
  label: string;
  unit: string;
}

export type BrandLayout = "calculator" | "catalog";

/**
 * 매주 바뀌는 판매 목록. 브랜드가 전 품목을 상시 판매하지 않고
 * 회차별로 일부만 여는 경우에 쓴다(예: 윤달베이커리 주간 라인업).
 *
 * available에는 반드시 도감(MenuItem.name) 기준 정식 이름을 넣는다.
 * 주문서 표기를 그대로 넣으면 화면에서 조용히 누락되므로,
 * 커밋 전 `node scripts/check-weekly.mjs`로 검증할 것.
 */
export interface WeeklyAvailability {
  weekLabel: string;
  updatedAt: string;
  available: string[];
}

export interface BrandConfig {
  id: string;
  name: string;
  subtitle: string;
  tip?: string;
  categories: MenuCategory[];
  nutritionKeys: NutritionKey[];
  // "calculator" (default) selects+sums; "catalog" browses photos + nutrition
  layout?: BrandLayout;
  // optional official source link shown in catalog footer
  sourceUrl?: string;
  // 이번 회차 판매 목록. 없으면 전 품목을 도감 순서대로 보여준다.
  weekly?: WeeklyAvailability;
  nutritionNote?: string[];
}
