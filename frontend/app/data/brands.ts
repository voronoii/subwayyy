import { subwayConfig } from "./subway";
import { saladyConfig } from "./salady";
import { pokeConfig } from "./poke";
import type { BrandConfig } from "./types";

export const brands: BrandConfig[] = [subwayConfig, saladyConfig, pokeConfig];

export function getBrandConfig(brandId: string): BrandConfig | undefined {
  return brands.find((b) => b.id === brandId);
}
