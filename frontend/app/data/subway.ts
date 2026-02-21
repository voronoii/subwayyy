import type { BrandConfig } from "./types";
import raw from "./_subway.json";

const data = raw as Record<string, { name: string; calories: number; protein: number; saturatedFat: number; sugar: number; sodium: number; weight?: number }[]>;

export const subwayConfig: BrandConfig = {
  id: "subway",
  name: "서브웨이",
  subtitle: "샌드위치 · 샐러드 · 사이드 영양성분 계산",
  tip: "샌드위치에는 빵이 포함되어 있지 않아요. 빵을 반드시 선택해주세요!",
  categories: [
    { id: "sandwiches", label: "샌드위치", icon: "🥪", items: data.sandwiches },
    { id: "breads", label: "빵", icon: "🍞", items: data.breads },
    { id: "salads", label: "샐러드", icon: "🥗", items: data.salads },
    { id: "cheeses", label: "치즈", icon: "🧀", items: data.cheeses },
    { id: "toppings", label: "토핑", icon: "🥓", items: data.toppings },
    { id: "sauces", label: "소스", icon: "🫙", items: data.sauces },
    { id: "sides", label: "사이드", icon: "🍪", items: data.sides },
  ],
  nutritionKeys: [
    { key: "calories", label: "칼로리", unit: "kcal" },
    { key: "protein", label: "단백질", unit: "g" },
    { key: "saturatedFat", label: "포화지방", unit: "g" },
    { key: "sugar", label: "당류", unit: "g" },
    { key: "sodium", label: "나트륨", unit: "mg" },
    { key: "weight", label: "중량", unit: "g" },
  ],
};
