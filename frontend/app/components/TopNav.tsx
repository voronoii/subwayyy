"use client";
import Link from "next/link";
import { brands } from "../data/brands";

interface TopNavProps {
  activeBrand: string;
}

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
      <Link href="/grass" className="grass-link">🌱</Link>
    </nav>
  );
}
