"use client";
import { useState, useCallback } from "react";
import type { MenuCategory } from "../data/types";

interface CategoryPillsProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  nutritionNote?: string[];
}

export default function CategoryPills({ categories, activeId, onSelect, nutritionNote }: CategoryPillsProps) {
  const [noteOpen, setNoteOpen] = useState(false);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setNoteOpen(false);
  }, []);

  return (
    <div className="cat-bar">
      <div className="cat-pills">
        {categories.map((cat, i) => (
          <div key={cat.id} className="cat-pill-wrap">
            <div
              className={`cat-pill${cat.id === activeId ? " active" : ""}`}
              onClick={() => onSelect(cat.id)}
            >
              {cat.icon} {cat.label}
            </div>
            {i === 0 && nutritionNote && nutritionNote.length > 0 && (
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
        ))}
      </div>

      {nutritionNote && nutritionNote.length > 0 && (
        <div className={`overlay${noteOpen ? " open" : ""}`} onClick={handleOverlayClick}>
          <div className="sheet">
            <div className="handle" />
            <h2>영양 정보 안내 ⓘ</h2>
            <ul className="note-list">
              {nutritionNote.map((line, i) => (
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
