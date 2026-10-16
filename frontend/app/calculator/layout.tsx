const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "서브웨이 · 샐러디 · 포케올데이 · 윤달베이커리 칼로리 계산기",
  url: "https://subwayyy.kr",
  description:
    "서브웨이·샐러디·포케올데이 조합별 칼로리 계산과 윤달베이커리 주간 판매목록·제품별 영양성분을 제공하는 무료 도구",
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
