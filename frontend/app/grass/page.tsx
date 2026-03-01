"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { getAllEntries, type GrassEntry } from "../lib/grassStore";
import { getCatPosition } from "../lib/catGenerator";
import TycoonCat from "../components/TycoonCat";
import TycoonScene from "../components/TycoonScene";

const BRAND_LABEL: Record<string, string> = { subway: "서브웨이", salady: "샐러디", poke: "포케올데이" };

export default function GrassPage() {
  const [entries, setEntries] = useState<GrassEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [justPlantedId, setJustPlantedId] = useState<string | null>(null);

  useEffect(() => {
    const all = getAllEntries();
    setEntries(all);
    if (sessionStorage.getItem("grassJustPlanted")) {
      setJustPlantedId(all[all.length - 1]?.id ?? null);
      sessionStorage.removeItem("grassJustPlanted");
    }
  }, []);

  const avgCalories = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((s, e) => s + e.totalCalories, 0) / entries.length);
  }, [entries]);

  const handleCatClick = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleOverlayClose = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeEntry = useMemo(() => {
    if (!activeId) return null;
    return entries.find((e) => e.id === activeId) ?? null;
  }, [activeId, entries]);

  const catPositions = useMemo(() => {
    return entries.map((entry, i) => ({
      entry,
      pos: getCatPosition(i, entries.length, entry.id),
    }));
  }, [entries]);

  return (
    <div className="tycoon-page">
      <nav className="tycoon-header">
        <Link href="/calculator/subway" className="tycoon-back">← 계산기</Link>
        <h1 className="tycoon-title">고양이 간식바 🐱</h1>
        <div className="tycoon-spacer" />
      </nav>

      <div className="tycoon-stats">
        <span>🐱 <strong>{entries.length}</strong>마리</span>
        <span className="tycoon-stats-dot">·</span>
        <span>평균 <strong>{avgCalories}</strong>kcal</span>
      </div>

      <div className="tycoon-scene-wrap">
        <TycoonScene />

        <div className="tycoon-cats-layer">
          {catPositions.map(({ entry, pos }) => (
            <div
              key={entry.id}
              className={`tycoon-cat-slot${justPlantedId === entry.id ? " tycoon-just-arrived" : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <TycoonCat
                entryId={entry.id}
                brandId={entry.brandId}
                size={52}
                onClick={() => handleCatClick(entry.id)}
                active={activeId === entry.id}
                isNew={justPlantedId === entry.id}
              />
            </div>
          ))}
        </div>
      </div>

      {activeEntry && (
        <div className="tycoon-bubble-overlay" onClick={handleOverlayClose}>
          <div className="tycoon-bubble" onClick={(e) => e.stopPropagation()}>
            <div className="tycoon-bubble-top">
              <TycoonCat entryId={activeEntry.id} brandId={activeEntry.brandId} size={36} />
              <div className="tycoon-bubble-info">
                <span className="tycoon-bubble-nick">{activeEntry.nickname}</span>
                <span className="tycoon-bubble-brand">{BRAND_LABEL[activeEntry.brandId] ?? activeEntry.brandId}</span>
              </div>
            </div>
            <div className="tycoon-bubble-menu">
              {activeEntry.menuNames.join(" + ")}
            </div>
            <div className="tycoon-bubble-kcal">{Math.round(activeEntry.totalCalories)}kcal</div>
            {activeEntry.comment && (
              <div className="tycoon-bubble-comment">&ldquo;{activeEntry.comment}&rdquo;</div>
            )}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="tycoon-empty">
          <p>아직 고양이가 없어요 🐾</p>
          <p>계산기에서 메뉴를 선택하고 고양이를 불러보세요!</p>
        </div>
      )}
    </div>
  );
}
