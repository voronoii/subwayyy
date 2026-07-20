import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "브랜드별 칼로리·영양성분 계산기";

interface BrandOg {
  emoji: string;
  title: string;
  sub: string;
  bg: string;
}

const BRAND_OG: Record<string, BrandOg> = {
  subway: {
    emoji: "🥪",
    title: "서브웨이 칼로리 계산기",
    sub: "샌드위치 · 빵 · 소스 조합별 영양성분",
    bg: "linear-gradient(135deg, #16a34a 0%, #22c55e 55%, #86efac 100%)",
  },
  salady: {
    emoji: "🥗",
    title: "샐러디 칼로리 계산기",
    sub: "샐러드 · 웜볼 · 랩 조합별 영양성분",
    bg: "linear-gradient(135deg, #15803d 0%, #4ade80 60%, #bbf7d0 100%)",
  },
  poke: {
    emoji: "🐟",
    title: "포케올데이 칼로리 계산기",
    sub: "포케 · 베이스 · 토핑 조합별 영양성분",
    bg: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 55%, #7dd3fc 100%)",
  },
  yundar: {
    emoji: "🥐",
    title: "윤달베이커리 영양성분 한눈에",
    sub: "삼각이 통밀스콘 · 칼로리 · 식이섬유 · 당류",
    bg: "linear-gradient(135deg, #92400e 0%, #d97706 55%, #fcd34d 100%)",
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const b = BRAND_OG[brand] ?? BRAND_OG.subway;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: b.bg,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 24 }}>{b.emoji}</div>
        <div style={{ fontSize: 68, fontWeight: 800, marginBottom: 16 }}>
          {b.title}
        </div>
        <div style={{ fontSize: 34, opacity: 0.95 }}>{b.sub}</div>
        <div
          style={{
            marginTop: 40,
            fontSize: 28,
            background: "rgba(255,255,255,0.2)",
            padding: "12px 32px",
            borderRadius: 999,
          }}
        >
          subwayyy.kr
        </div>
      </div>
    ),
    size,
  );
}
