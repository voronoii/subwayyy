"use client";
import type { MenuItem } from "../data/types";

interface SelectedChipsProps {
  items: MenuItem[];
  onRemove: (name: string) => void;
}

export default function SelectedChips({ items, onRemove }: SelectedChipsProps) {
  if (items.length === 0) return null;

  return (
    <div className="sel-area">
      <div className="sel-label">선택한 메뉴</div>
      <div className="sel-chips">
        {items.map((item) => (
          <div key={item.name} className="sel-chip">
            {item.name}
            <button
              className="x"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.name);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
