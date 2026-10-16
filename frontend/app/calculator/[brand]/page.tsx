import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrandConfig, brands } from "../../data/brands";
import { calculatorMetadata, calculatorStructuredData } from "../../lib/calculatorSeo";
import NutritionReference, { WeeklySelection } from "../../components/NutritionReference";
import NutritionSources from "../../components/NutritionSources";
import CalculatorClient from "./CalculatorClient";
import CatalogClient from "./CatalogClient";

interface Props { params: Promise<{ brand: string }> }

export function generateStaticParams() {
  return brands.map((brand) => ({ brand: brand.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const config = getBrandConfig(brand);
  return config ? calculatorMetadata(config) : {};
}

export default async function CalculatorPage({ params }: Props) {
  const { brand } = await params;
  const config = getBrandConfig(brand);
  if (!config) notFound();
  const referenceContent = <><NutritionReference config={config} /><NutritionSources brandId={brand} /></>;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorStructuredData(config)).replace(/</g, "\\u003c") }}
      />
      {config.layout === "catalog"
        ? <CatalogClient brandId={brand} weeklyContent={<WeeklySelection config={config} />} referenceContent={referenceContent} />
        : <CalculatorClient brandId={brand} referenceContent={referenceContent} />}
    </>
  );
}
