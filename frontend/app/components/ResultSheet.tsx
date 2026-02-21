"use client";
import { useCallback, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import type { MenuItem, NutritionKey } from "../data/types";

interface ResultSheetProps {
  open: boolean;
  onClose: () => void;
  totals: Record<string, number>;
  nutritionKeys: NutritionKey[];
  selectedItems: MenuItem[];
  brandName?: string;
}

export default function ResultSheet({ open, onClose, totals, nutritionKeys, selectedItems, brandName }: ResultSheetProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleCapture = useCallback(async () => {
    const el = captureRef.current;
    if (!el || capturing) return;

    setCapturing(true);
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: "#FFFFFF",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>영양성분 결과</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#F5F5F7;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:-apple-system,sans-serif;padding:20px}
img{max-width:100%;height:auto;border-radius:16px;box-shadow:0 2px 20px rgba(0,0,0,0.1)}
p{margin-top:16px;font-size:14px;color:#8E8E93}
</style></head><body>
<img src="${dataUrl}" alt="영양성분 결과"/>
<p>이미지를 길게 눌러 저장하세요</p>
</body></html>`);
        w.document.close();
      }
    } catch {
    } finally {
      setCapturing(false);
    }
  }, [capturing]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={handleOverlayClick}>
      <div className="sheet">
        <div className="handle" />
        <div ref={captureRef} className="capture-area">
          <h2>영양성분 결과</h2>
          <div className="sheet-items">
            {selectedItems.map((item) => item.name).join(", ")}
          </div>
          {nutritionKeys.map((nk, i) => (
            <div key={nk.key} className={`n-row${i === 0 ? " hi" : ""}`}>
              <div className="n-lbl">{nk.label}</div>
              <div className="n-val">
                {totals[nk.key] ?? 0}
                {nk.unit}
              </div>
            </div>
          ))}
          {brandName && (
            <div className="capture-footer">
              {brandName} 영양성분 계산기
            </div>
          )}
        </div>
        <div className="share-row">
          <button className="btn-p" onClick={onClose}>
            닫기
          </button>
          <button className="btn-s" onClick={handleCapture} disabled={capturing}>
            {capturing ? "저장 중..." : "이미지 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
