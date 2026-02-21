"use client";
import type { MenuCategory, MenuItem } from "../data/types";

interface MenuGridProps {
  category: MenuCategory;
  selectedNames: Set<string>;
  onToggle: (item: MenuItem) => void;
}

export default function MenuGrid({ category, selectedNames, onToggle }: MenuGridProps) {
  return (
    <div className="menu-section">
      <div className="sec-title">
        <span className="icon">{category.icon}</span> {category.label}
      </div>
      <div className="menu-grid">
        {category.items.map((item) => (
          <div
            key={item.name}
            className={`menu-card${selectedNames.has(item.name) ? " selected" : ""}`}
            onClick={() => onToggle(item)}
          >
            <div className="name">{item.name}</div>
            <div className="kcal">{item.calories} kcal</div>
            <div className="detail">단백질 {item.protein}g</div>
          </div>
        ))}
      </div>
    </div>
  );
}
