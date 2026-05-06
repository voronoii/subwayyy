"use client";
import Link from "next/link";
import { brands } from "../data/brands";

interface TopNavProps {
  activeBrand: string;
}

const BUILD_ISO = process.env.NEXT_PUBLIC_BUILD_TIME ?? "";
// "2026-05-06T..." → "260506"
const BUILD_DATE_SHORT =
  BUILD_ISO.length >= 10
    ? BUILD_ISO.slice(2, 4) + BUILD_ISO.slice(5, 7) + BUILD_ISO.slice(8, 10)
    : "";

export default function TopNav({ activeBrand }: TopNavProps) {
  return (
    <nav className="top-nav">
      <div className="brand-tabs">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/calculator/${b.id}`}
            className={`brand-tab${b.id === activeBrand ? " active" : ""}`}
          >
            {b.name}
          </Link>
        ))}
      </div>
      <div className="top-nav-right">
        <Link href="/grass" className="grass-link">🐱</Link>
        {BUILD_DATE_SHORT && (
          <span className="version-tag" title={`Build ${BUILD_ISO}`}>
            <span className="version-date">{BUILD_DATE_SHORT}</span>
            <span className="version-sub">updated</span>
          </span>
        )}
      </div>
    </nav>
  );
}
