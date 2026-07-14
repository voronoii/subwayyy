"use client";
import { useState, useCallback } from "react";
import type { MenuCategory, MenuItem } from "../data/types";

interface MenuGridProps {
  category: MenuCategory;
  selectedNames: Set<string>;
  onToggle: (item: MenuItem) => void;
  nutritionNote?: string[];
}

export default function MenuGrid({ category, selectedNames, onToggle, nutritionNote }: MenuGridProps) {
  const [noteOpen, setNoteOpen] = useState(false);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setNoteOpen(false);
  }, []);

  const hasNote = !!nutritionNote && nutritionNote.length > 0;

  return (
    <div className="menu-section">
      <div className="sec-title">
        <span className="icon">{category.icon}</span> {category.label}
        {hasNote && (
          <button
            type="button"
            className="cat-info-btn"
            aria-label="영양 정보 안내"
            onClick={() => setNoteOpen(true)}
          >
            ⓘ
          </button>
        )}
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

      {hasNote && (
        <div className={`overlay${noteOpen ? " open" : ""}`} onClick={handleOverlayClick}>
          <div className="sheet">
            <div className="handle" />
            <h2>영양 정보 안내 ⓘ</h2>
            <ul className="note-list">
              {nutritionNote!.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
            <div className="share-row">
              <button className="btn-p" onClick={() => setNoteOpen(false)}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
