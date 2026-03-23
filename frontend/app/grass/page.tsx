"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { getAllEntries, type GrassEntry } from "../lib/grassStore";
import TycoonCat from "../components/TycoonCat";
import TycoonScene from "../components/TycoonScene";
import { useCatSimulation } from "../hooks/useCatSimulation";

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

  const { cats, handleInteract } = useCatSimulation(entries);

  const avgCalories = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((s, e) => s + e.totalCalories, 0) / entries.length);
  }, [entries]);

  const handleCatClick = useCallback((id: string) => {
    handleInteract(id);
    setActiveId((prev) => (prev === id ? null : id));
  }, [handleInteract]);

  const handleOverlayClose = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeEntry = useMemo(() => {
    if (!activeId) return null;
    return entries.find((e) => e.id === activeId) ?? null;
  }, [activeId, entries]);

  return (
    <div className="tycoon-page">
      <nav className="tycoon-header">
        <Link href="/calculator/subway" className="tycoon-back">← 계산기</Link>
        <h1 className="tycoon-title">고양이 놀이방 🐱</h1>
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
          {cats.map((cat) => {
            const entry = entries.find(e => e.id === cat.id);
            if (!entry) return null;
            return (
              <div
                key={cat.id}
                className={`tycoon-cat-slot${justPlantedId === cat.id ? " tycoon-just-arrived" : ""}`}
                style={{
                  left: `${cat.x}%`,
                  top: `${cat.y}%`,
                  zIndex: activeId === cat.id ? 50 : 2,
                  transition: cat.state === 'walk' ? 'none' : 'left 0.3s ease, top 0.3s ease',
                }}
              >
                <TycoonCat
                  entryId={entry.id}
                  brandId={entry.brandId}
                  size={52}
                  onClick={() => handleCatClick(cat.id)}
                  active={activeId === cat.id}
                  isNew={justPlantedId === cat.id}
                  pose={cat.state}
                  facing={cat.facing}
                  bobPhase={cat.bobPhase}
                />
              </div>
            );
          })}
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
