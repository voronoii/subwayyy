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
  nutritionNote: [
    "15cm 샌드위치의 영양 정보는 기본 야채 5종(양상추, 토마토, 오이, 피망(파프리카), 양파), 15cm 위트 브레드 및 제품에 따른 미트류가 포함되어 있으며, 치즈와 소스는 제외됩니다.",
    "타코 샐러드의 영양 정보는 야채 (양상추, 토마토, 피망(파프리카), 양파, 할라피뇨), 아보카도, 소스, 치즈, 또띠야 및 제품에 따른 미트류가 포함됩니다.",
    "타코 샐러드를 제외한 샐러드의 영양 정보는 기본 야채 5종(양상추, 토마토, 오이, 피망(파프리카), 양파) 및 제품에 따른 미트류가 포함되어 있으며, 치즈와 소스는 제외됩니다.",
    "단, 메뉴명에 '치즈'가 포함되는 경우 치즈의 영양정보도 포함됩니다.",
    "랩, 그릴드 랩, 썹픽의 영양 정보는 치즈와 소스를 포함한 고정 레시피를 기준으로 합니다.",
  ],
};
