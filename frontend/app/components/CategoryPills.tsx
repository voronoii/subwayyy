"use client";
import type { MenuCategory } from "../data/types";

interface CategoryPillsProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function CategoryPills({ categories, activeId, onSelect }: CategoryPillsProps) {
  return (
    <div className="cat-bar">
      <div className="cat-pills">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`cat-pill${cat.id === activeId ? " active" : ""}`}
            onClick={() => onSelect(cat.id)}
          >
            {cat.icon} {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
