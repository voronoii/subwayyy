import type { BrandConfig, MenuItem, WeeklyAvailability } from "./types";
import raw from "./_yundar.json";
import weeklyRaw from "./_yundar-weekly.json";

const data = raw as Record<string, MenuItem[]>;
const weekly = weeklyRaw as WeeklyAvailability;

export const yundarConfig: BrandConfig = {
  id: "yundar",
  name: "윤달베이커리",
  subtitle: "삼각이 통밀스콘 · 사진과 영양성분 도감",
  layout: "catalog",
  sourceUrl: "https://smartstore.naver.com/yunder",
  weekly,
  categories: [
    { id: "samgak", label: "삼각이", icon: "🥐", items: data.samgak },
    { id: "creambread", label: "크림빵", icon: "🥯", items: data.creambread },
    { id: "banryeobbang", label: "반려빵", icon: "🍞", items: data.banryeobbang },
    { id: "samdu", label: "삼두과자", icon: "🍪", items: data.samdu },
  ],
  nutritionKeys: [
    { key: "calories", label: "칼로리", unit: "kcal" },
    { key: "protein", label: "단백질", unit: "g" },
    { key: "fiber", label: "식이섬유", unit: "g" },
    { key: "sugar", label: "당류", unit: "g" },
    { key: "fat", label: "지방", unit: "g" },
    { key: "netCarbs", label: "순탄수", unit: "g" },
    { key: "sodium", label: "나트륨", unit: "mg" },
    { key: "weight", label: "중량", unit: "g" },
  ],
};
