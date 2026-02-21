"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { getAllEntries, getGrassColor, type GrassEntry } from "../lib/grassStore";
import PixelCat from "../components/PixelCat";

const COLS = 7;
const MIN_ROWS = 6;

export default function GrassPage() {
  const [entries, setEntries] = useState<GrassEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [justPlanted, setJustPlanted] = useState(false);

  useEffect(() => {
    setEntries(getAllEntries());
    if (sessionStorage.getItem("grassJustPlanted")) {
      setJustPlanted(true);
      sessionStorage.removeItem("grassJustPlanted");
    }
  }, []);

  const totalCells = useMemo(() => {
    const minCells = MIN_ROWS * COLS;
    return Math.max(minCells, Math.ceil(entries.length / COLS) * COLS + COLS);
  }, [entries.length]);

  const avgCalories = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((s, e) => s + e.totalCalories, 0) / entries.length);
  }, [entries]);

  const handleCellClick = useCallback((id: string | null) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleOverlayClose = useCallback(() => {
    setActiveId(null);
  }, []);

  const cells: (GrassEntry | null)[] = useMemo(() => {
    const arr: (GrassEntry | null)[] = [...entries];
    while (arr.length < totalCells) arr.push(null);
    return arr;
  }, [entries, totalCells]);

  const activeEntry = useMemo(() => {
    if (!activeId) return null;
    return entries.find((e) => e.id === activeId) ?? null;
  }, [activeId, entries]);

  const brandLabel: Record<string, string> = { subway: "서브웨이", salady: "샐러디", poke: "포케올데이" };

  return (
    <div className="grass-page">
      <nav className="grass-header">
        <Link href="/calculator/subway" className="grass-back">← 계산기</Link>
        <h1 className="grass-title">메뉴 잔디밭 🌱</h1>
        <div className="grass-spacer" />
      </nav>

      <div className="grass-stats">
        <span>총 <strong>{entries.length}</strong>개 심어짐</span>
        <span className="grass-stats-dot">·</span>
        <span>평균 <strong>{avgCalories}</strong>kcal</span>
      </div>

      <div className="grass-legend">
        <span className="grass-legend-label">칼로리</span>
        <span className="grass-legend-block" style={{ background: "#9be9a8" }} />
        <span className="grass-legend-block" style={{ background: "#40c463" }} />
        <span className="grass-legend-block" style={{ background: "#30a14e" }} />
        <span className="grass-legend-block" style={{ background: "#216e39" }} />
        <span className="grass-legend-block" style={{ background: "#0e4429" }} />
        <span className="grass-legend-label">많음</span>
      </div>

      <div className="grass-grid">
        {cells.map((entry, i) => {
          const isPlanted = entry !== null;
          const isActive = entry?.id === activeId;
          const isNew = justPlanted && i === entries.length - 1;

          return (
            <div
              key={entry?.id ?? `dirt-${i}`}
              className={`grass-cell${isPlanted ? " planted" : " dirt"}${isActive ? " active" : ""}${isNew ? " just-planted" : ""}`}
              style={isPlanted ? { backgroundColor: getGrassColor(entry.totalCalories) } : undefined}
              onClick={() => isPlanted && handleCellClick(entry.id)}
            >
              {isPlanted && (
                <div className="grass-cat">
                  <PixelCat brandId={entry.brandId} size={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeEntry && (
        <div className="grass-bubble-overlay" onClick={handleOverlayClose}>
          <div className="grass-bubble" onClick={(e) => e.stopPropagation()}>
            <div className="grass-bubble-nick">
              <PixelCat brandId={activeEntry.brandId} size={18} />
              <span>{activeEntry.nickname}</span>
              <span className="grass-bubble-brand">{brandLabel[activeEntry.brandId] ?? activeEntry.brandId}</span>
            </div>
            <div className="grass-bubble-menu">
              {activeEntry.menuNames.join(" + ")}
            </div>
            <div className="grass-bubble-kcal">{Math.round(activeEntry.totalCalories)}kcal</div>
            {activeEntry.comment && (
              <div className="grass-bubble-comment">&ldquo;{activeEntry.comment}&rdquo;</div>
            )}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="grass-empty">
          <p>아직 심어진 메뉴가 없어요</p>
          <p>계산기에서 메뉴를 선택하고 심어보세요!</p>
        </div>
      )}
    </div>
  );
}
