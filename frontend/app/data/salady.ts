import type { BrandConfig } from "./types";
import raw from "./_salady.json";

const data = raw as Record<string, { name: string; calories: number; protein: number; saturatedFat: number; sugar: number; sodium: number; carbs?: number; fat?: number }[]>;

export const saladyConfig: BrandConfig = {
  id: "salady",
  name: "샐러디",
  subtitle: "샐러드 · 포케볼 · 랩 영양성분 계산",
  tip: "드레싱은 별도 선택이에요. 기본 메뉴에는 포함되지 않습니다.",
  categories: [
    { id: "salads", label: "샐러드", icon: "🥗", items: data.salads },
    { id: "warmbowls", label: "포케/누들볼", icon: "🍲", items: data.warmbowls },
    { id: "proteinBoxes", label: "프로틴박스", icon: "💪", items: data.proteinBoxes },
    { id: "sandWraps", label: "랩/치아바타", icon: "🌯", items: data.sandWraps },
    { id: "beverages", label: "음료", icon: "🥤", items: data.beverages },
    { id: "dressings", label: "드레싱", icon: "🫙", items: data.dressings },
    { id: "toppings", label: "토핑", icon: "🥬", items: data.toppings },
    { id: "sidesSoups", label: "스프", icon: "🍜", items: data.sidesSoups },
  ],
  nutritionKeys: [
    { key: "calories", label: "칼로리", unit: "kcal" },
    { key: "carbs", label: "탄수화물", unit: "g" },
    { key: "protein", label: "단백질", unit: "g" },
    { key: "fat", label: "지방", unit: "g" },
    { key: "saturatedFat", label: "포화지방", unit: "g" },
    { key: "sugar", label: "당류", unit: "g" },
    { key: "sodium", label: "나트륨", unit: "mg" },
  ],
};
