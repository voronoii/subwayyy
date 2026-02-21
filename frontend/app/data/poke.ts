import type { BrandConfig } from "./types";
import raw from "./_poke.json";

const data = raw as Record<string, { name: string; calories: number; protein: number; saturatedFat: number; sugar: number; sodium: number; weight?: number; carbs?: number; fat?: number }[]>;

export const pokeConfig: BrandConfig = {
  id: "poke",
  name: "포케올데이",
  subtitle: "포케볼 · 토핑 · 소스 영양성분 계산",
  tip: "포케볼은 베이스(밥)가 포함된 가격이에요. 베이스를 따로 선택하지 않아도 됩니다.",
  categories: [
    { id: "pokes", label: "포케", icon: "🐟", items: data.pokes },
    { id: "bases", label: "베이스", icon: "🍚", items: data.bases },
    { id: "toppings", label: "토핑", icon: "🥑", items: data.toppings },
    { id: "sauces", label: "소스", icon: "🫙", items: data.sauces },
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
