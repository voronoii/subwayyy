import type { MetadataRoute } from "next";

const BASE = "https://subwayyy.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/youth-savings", "/youth-savings/eligibility", "/youth-savings/calculator"].map((path) => ({
      url: `${BASE}${path}`,
      // 페이지 본문·검색 정보 갱신일. 정책 자료 확인일과는 별개다.
      lastModified: new Date("2026-10-16T00:00:00+09:00"),
      changeFrequency: "weekly" as const,
      priority: path === "/youth-savings" ? 0.9 : 0.8,
    })),
    {
      url: `${BASE}/calculator/subway`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/calculator/salady`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calculator/poke`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/calculator/yundar`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/grass`,
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];
}
