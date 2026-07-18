import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://subwayyy.kr"),
  title: {
    default: "칼로리 계산기 — 서브웨이 · 샐러디 · 포케올데이 · 윤달베이커리",
    template: "%s | subwayyy.kr",
  },
  description:
    "다이어터를 위한 영양성분 계산기. 서브웨이·샐러디·포케올데이 조합별 칼로리 계산과 윤달베이커리 삼각이(통밀스콘) 영양성분 도감을 무료로 제공합니다.",
  keywords: [
    "서브웨이 칼로리",
    "샐러디 칼로리",
    "포케올데이 칼로리",
    "윤달베이커리 칼로리",
    "윤달 삼각이 영양성분",
    "통밀 스콘 칼로리",
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
  verification: {
    other: {
      "naver-site-verification": "2e6691a1007df9c965d266f0b5d6a94e5cda1eb7",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "서브웨이 · 샐러디 · 포케올데이 · 윤달베이커리 칼로리 계산기",
  url: "https://subwayyy.kr",
  description:
    "서브웨이, 샐러디, 포케올데이 메뉴의 칼로리를 조합별로 계산하고, 윤달베이커리 삼각이 통밀스콘의 영양성분을 사진 도감으로 제공하는 무료 도구",
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
