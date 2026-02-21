export interface MenuItem {
  name: string;
  calories: number;
  protein: number;
  saturatedFat: number;
  sugar: number;
  sodium: number;
  weight?: number;
  carbs?: number;
  fat?: number;
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

export interface BrandConfig {
  id: string;
  name: string;
  subtitle: string;
  tip?: string;
  categories: MenuCategory[];
  nutritionKeys: NutritionKey[];
}
