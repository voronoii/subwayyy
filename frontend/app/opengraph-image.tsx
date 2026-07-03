import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "서브웨이 · 샐러디 · 포케올데이 칼로리 계산기";

export default function OgImage() {
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
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 55%, #86efac 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 24 }}>🥪🐱</div>
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>
          칼로리 계산기
        </div>
        <div style={{ fontSize: 36, opacity: 0.95 }}>
          서브웨이 · 샐러디 · 포케올데이
        </div>
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
