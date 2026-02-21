"use client";
import { BRAND_COLORS } from "../lib/grassStore";

interface PixelCatProps {
  brandId: string;
  size?: number;
}

export default function PixelCat({ brandId, size = 28 }: PixelCatProps) {
  const c = BRAND_COLORS[brandId] ?? BRAND_COLORS.subway;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      <rect x="2" y="1" width="2" height="3" fill={c.dark} />
      <rect x="12" y="1" width="2" height="3" fill={c.dark} />

      <rect x="3" y="3" width="10" height="7" fill={c.body} />
      <rect x="2" y="4" width="1" height="5" fill={c.body} />
      <rect x="13" y="4" width="1" height="5" fill={c.body} />

      <rect x="4" y="5" width="2" height="2" fill="#fff" />
      <rect x="10" y="5" width="2" height="2" fill="#fff" />
      <rect x="5" y="6" width="1" height="1" fill="#1A1A1A" />
      <rect x="11" y="6" width="1" height="1" fill="#1A1A1A" />

      <rect x="7" y="7" width="2" height="1" fill={c.dark} />
      <rect x="6" y="8" width="1" height="1" fill={c.dark} />
      <rect x="9" y="8" width="1" height="1" fill={c.dark} />

      <rect x="3" y="10" width="10" height="4" fill={c.body} />
      <rect x="2" y="11" width="1" height="3" fill={c.body} />
      <rect x="13" y="11" width="1" height="3" fill={c.body} />

      <rect x="3" y="14" width="3" height="2" fill={c.dark} />
      <rect x="10" y="14" width="3" height="2" fill={c.dark} />

      <rect x="13" y="11" width="1" height="1" fill={c.light} />
      <rect x="14" y="12" width="1" height="1" fill={c.light} />
      <rect x="14" y="13" width="1" height="2" fill={c.body} />
    </svg>
  );
}
