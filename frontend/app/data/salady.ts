import type { BrandConfig, MenuItem } from "./types";
import raw from "./_salady.json";

const data = raw satisfies Record<string, MenuItem[]>;

export const saladyConfig: BrandConfig = {
  id: "salady",
  name: "샐러디",
  subtitle: "샐러드 · 포케볼 · 랩 · 샌드위치 영양성분 계산",
  tip: "2026년 10월 영양성분표 기준입니다. 선택한 항목은 모두 합산되며, 베이스를 선택해도 기존 베이스가 자동으로 교체되지는 않습니다.",
  categories: [
    { id: "salads", label: "샐러드", icon: "🥗", items: data.salads },
    { id: "warmbowls", label: "포케/누들볼", icon: "🍲", items: data.warmbowls },
    { id: "proteinBoxes", label: "프로틴박스", icon: "💪", items: data.proteinBoxes },
    { id: "sandWraps", label: "랩/샌드위치", icon: "🌯", items: data.sandWraps },
    { id: "beverages", label: "음료", icon: "🥤", items: data.beverages },
    { id: "dressings", label: "드레싱", icon: "🫙", items: data.dressings },
    { id: "toppings", label: "토핑", icon: "🥬", items: data.toppings },
    { id: "sidesSoups", label: "사이드/스프", icon: "🍜", items: data.sidesSoups },
    { id: "bases", label: "볼 베이스", icon: "🍚", items: data.bases },
    { id: "proteinBases", label: "프로틴박스 베이스", icon: "🍝", items: data.proteinBases },
  ],
  nutritionKeys: [
    { key: "calories", label: "칼로리", unit: "kcal" },
    { key: "carbs", label: "탄수화물", unit: "g" },
    { key: "protein", label: "단백질", unit: "g" },
    { key: "fat", label: "지방", unit: "g" },
    { key: "saturatedFat", label: "포화지방", unit: "g" },
    { key: "sugar", label: "당류", unit: "g" },
    { key: "sodium", label: "나트륨", unit: "mg" },
    { key: "weight", label: "제공량", unit: "g" },
  ],
};
