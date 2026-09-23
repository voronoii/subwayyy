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

export default function NutritionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </>
  );
}
