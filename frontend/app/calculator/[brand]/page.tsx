import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandConfig, brands } from "../../data/brands";
import CalculatorClient from "./CalculatorClient";

interface Props {
  params: Promise<{ brand: string }>;
}

const BRAND_SEO: Record<string, { title: string; description: string }> = {
  subway: {
    title: "서브웨이 칼로리 계산기 — 샌드위치 조합별 영양성분",
    description:
      "서브웨이 샌드위치·빵·치즈·소스·토핑 조합의 칼로리를 바로 계산하세요. 에그마요, 이탈리안 비엠티 등 전 메뉴의 열량, 단백질, 당류, 나트륨을 무료로 확인할 수 있습니다.",
  },
  salady: {
    title: "샐러디 칼로리 계산기 — 샐러드·랩 조합별 영양성분",
    description:
      "샐러디 샐러드, 웜볼, 랩, 드레싱 조합의 칼로리를 바로 계산하세요. 메뉴별 열량, 단백질, 당류, 나트륨을 무료로 확인할 수 있는 다이어터 필수 도구입니다.",
  },
  poke: {
    title: "포케올데이 칼로리 계산기 — 포케 조합별 영양성분",
    description:
      "포케올데이 포케, 베이스, 토핑, 소스 조합의 칼로리를 바로 계산하세요. 연어 포케, 참치 포케 등 메뉴별 열량과 영양성분을 무료로 확인할 수 있습니다.",
  },
};

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const seo = BRAND_SEO[brand];
  if (!seo) return {};
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: `/calculator/${brand}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/calculator/${brand}`,
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { brand } = await params;
  const config = getBrandConfig(brand);
  if (!config) notFound();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.name} 메뉴 칼로리`,
    itemListElement: config.categories[0]?.items.slice(0, 30).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${config.name} ${item.name} — ${item.calories}kcal`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <CalculatorClient brandId={brand} />
    </>
  );
}
