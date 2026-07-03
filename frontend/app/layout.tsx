import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://subwayyy.kr"),
  title: {
    default: "칼로리 계산기 — 서브웨이 · 샐러디 · 포케올데이",
    template: "%s | subwayyy.kr",
  },
  description:
    "다이어터를 위한 프랜차이즈 메뉴 영양성분 계산기. 메뉴, 토핑, 소스를 선택하면 칼로리와 영양성분을 자동으로 계산해드립니다.",
  keywords: [
    "서브웨이 칼로리",
    "샐러디 칼로리",
    "포케올데이 칼로리",
    "칼로리 계산기",
    "영양성분",
    "다이어트",
    "식단관리",
  ],
  openGraph: {
    siteName: "subwayyy.kr 칼로리 계산기",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "서브웨이 · 샐러디 · 포케올데이 칼로리 계산기",
  url: "https://subwayyy.kr",
  description:
    "서브웨이, 샐러디, 포케올데이 메뉴의 칼로리와 영양성분을 조합별로 계산해주는 무료 도구",
  applicationCategory: "HealthApplication",
  operatingSystem: "All",
  inLanguage: "ko",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1825078358159503"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
