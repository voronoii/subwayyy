import type { Metadata } from "next";

const SITE_URL = "https://subwayyy.kr";

export const SAVINGS_PAGES = {
  home: {
    path: "/youth-savings",
    name: "청년미래적금 신청 안내",
    title: "청년미래적금 신청기간·가입조건·만기 계산기 (2026)",
    description:
      "2026 청년미래적금 2차 신청기간과 가입조건을 확인하세요. 일반형·우대형 대상자 자가진단과 월 납입액·은행 금리에 따른 3년 만기 예상 수령액 계산기를 제공합니다.",
  },
  calculator: {
    path: "/youth-savings/calculator",
    name: "청년미래적금 만기 계산기",
    title: "청년미래적금 만기 계산기 — 일반형·우대형 비교",
    description:
      "월 납입액과 은행 금리로 청년미래적금 3년 만기 예상 수령액을 계산하세요. 일반형 6%, 우대형 12%, 비과세형의 원금·이자·정부기여금을 비교합니다.",
  },
  eligibility: {
    path: "/youth-savings/eligibility",
    name: "청년미래적금 가입조건 자가진단",
    title: "청년미래적금 가입조건 — 일반형·우대형 대상자 확인",
    description:
      "생년월일, 2025년 개인소득과 가구소득, 가입 이력으로 청년미래적금 가입 가능성을 확인하세요. 네 단계의 자가진단으로 일반형·우대형 예상 가입유형과 추가 확인 사항을 안내합니다.",
  },
} as const;

export type SavingsPage = keyof typeof SAVINGS_PAGES;

export function savingsMetadata(page: SavingsPage): Metadata {
  const { path, title, description } = SAVINGS_PAGES[page];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "subwayyy.kr",
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: "/youth-savings/og.png",
          width: 1200,
          height: 630,
          alt: "청년미래적금 신청 안내·대상자 확인·만기 계산기",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/youth-savings/og.png"],
    },
  };
}

export function savingsStructuredData(page: SavingsPage) {
  const { path, title, description } = SAVINGS_PAGES[page];
  const url = `${SITE_URL}${path}`;
  const trail: { name: string; item: string }[] = [
    { name: "subwayyy.kr", item: SITE_URL },
    {
      name: SAVINGS_PAGES.home.name,
      item: `${SITE_URL}${SAVINGS_PAGES.home.path}`,
    },
  ];
  if (page !== "home") {
    trail.push({ name: SAVINGS_PAGES[page].name, item: url });
  }
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "ko-KR",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "subwayyy.kr",
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: trail.map(({ name, item }, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          item,
        })),
      },
    ],
  };
}
