import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "칼로리 계산기 — 서브웨이 · 샐러디 · 포케올데이",
  description: "다이어터를 위한 프랜차이즈 메뉴 영양성분 계산기. 메뉴, 토핑, 소스를 선택하면 칼로리와 영양성분을 자동으로 계산해드립니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
