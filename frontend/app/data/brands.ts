import { subwayConfig } from "./subway";
import { saladyConfig } from "./salady";
import { pokeConfig } from "./poke";
import { yundarConfig } from "./yundar";
import type { BrandConfig } from "./types";

export const brands: BrandConfig[] = [subwayConfig, saladyConfig, pokeConfig, yundarConfig];

export function getBrandConfig(brandId: string): BrandConfig | undefined {
  return brands.find((b) => b.id === brandId);
}
