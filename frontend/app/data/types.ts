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
}
