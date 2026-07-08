import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandConfig, brands } from "../../data/brands";
import type { MenuItem } from "../../data/types";
import { catalogStats, catalogFaqs } from "../../lib/catalogSeo";
import CalculatorClient from "./CalculatorClient";
import CatalogClient from "./CatalogClient";

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
  yundar: {
    title: "윤달베이커리 삼각이 영양성분 도감 — 통밀스콘 칼로리",
    description:
      "윤달베이커리 삼각이 통밀스콘 전 메뉴의 사진과 칼로리·단백질·식이섬유·당류를 한눈에. 저당·고식이섬유 비건 스콘을 검색하고 장바구니에 담아보세요.",
  },
};

const BRAND_KEYWORDS: Record<string, string[]> = {
  yundar: [
    "윤달베이커리 영양성분",
    "윤달 삼각이 칼로리",
    "윤달 스콘 영양성분",
    "윤달베이커리 칼로리",
    "윤달 삼각이 영양성분",
    "통밀 스콘 칼로리",
    "저당 스콘",
    "비건 스콘",
    "다이어트 빵",
    "식사대용 식단빵",
  ],
};

function nutritionInfo(item: MenuItem) {
  if (item.noNutrition) return undefined;
  const info: Record<string, string> = {
    "@type": "NutritionInformation",
    calories: `${item.calories} kcal`,
    proteinContent: `${item.protein} g`,
    sugarContent: `${item.sugar} g`,
  };
  if (typeof item.fat === "number") info.fatContent = `${item.fat} g`;
  if (typeof item.fiber === "number") info.fiberContent = `${item.fiber} g`;
  if (typeof item.netCarbs === "number") info.carbohydrateContent = `${item.netCarbs} g`;
  if (typeof item.sodium === "number") info.sodiumContent = `${item.sodium} mg`;
  if (typeof item.weight === "number") info.servingSize = `${item.weight} g`;
  return info;
}

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
    keywords: BRAND_KEYWORDS[brand],
    alternates: {
      canonical: `/calculator/${brand}`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/calculator/${brand}`,
      type: "website",
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { brand } = await params;
  const config = getBrandConfig(brand);
  if (!config) notFound();

  const isCatalog = config.layout === "catalog";
  // catalog brands: expose every category's items so all products are machine-readable
  const items = isCatalog
    ? config.categories.flatMap((c) => c.items)
    : config.categories[0]?.items ?? [];

  // Catalog brands (윤달) expose full nutrition per item + FAQ for rich results;
  // calculator brands keep the lighter name-only list.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.name} 메뉴 칼로리·영양성분`,
    numberOfItems: items.length,
    itemListElement: (isCatalog ? items : items.slice(0, 30)).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...(isCatalog
        ? {
            item: {
              "@type": "MenuItem",
              name: item.name,
              ...(nutritionInfo(item) ? { nutrition: nutritionInfo(item) } : {}),
            },
          }
        : { name: `${config.name} ${item.name} — ${item.calories}kcal` }),
    })),
  };

  const faqJsonLd = isCatalog
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: catalogFaqs(config.name, catalogStats(config.categories[0]?.items ?? [])).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {isCatalog ? <CatalogClient brandId={brand} /> : <CalculatorClient brandId={brand} />}
    </>
  );
}
