"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { pixelateImage } from "../lib/pixelate";
import { addEntry, type GrassEntry } from "../lib/grassStore";

interface PhotoCatModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (entry: GrassEntry) => void;
}

export default function PhotoCatModal({ open, onClose, onSaved }: PhotoCatModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sprite, setSprite] = useState<string | null>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일이나 배경 제거 옵션이 바뀌면 다시 변환
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setBusy(true);
    setError("");
    pixelateImage(file, { removeBg })
      .then((url) => {
        if (!cancelled) setSprite(url);
      })
      .catch(() => {
        if (!cancelled) setError("사진을 변환하지 못했어요. 다른 사진으로 시도해 주세요.");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file, removeBg]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleSave = useCallback(() => {
    if (!sprite) return;
    const entry = addEntry({
      brandId: "photo",
      menuNames: [],
      totalCalories: 0,
      nickname: name.trim() || "우리집 냥이",
      comment: comment.trim(),
      kind: "photo",
      spriteUrl: sprite,
    });
    setFile(null);
    setSprite(null);
    setName("");
    setComment("");
    onSaved(entry);
  }, [sprite, name, comment, onSaved]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={handleOverlayClick}>
      <div className="sheet">
        <div className="handle" />
        <h2>내 고양이 데려오기 📷</h2>
        <p className="sheet-sub">
          사진을 올리면 픽셀 고양이로 변신해서 놀이방에 살게 돼요.
          <br />
          변환은 내 폰 안에서만 — 사진은 어디에도 업로드되지 않아요.
        </p>

        <div className="photo-cat-preview">
          {sprite ? (
            // 픽셀 스프라이트 미리보기 (data URL이라 next/image 불필요)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sprite} alt="픽셀 고양이 미리보기" className="photo-cat-sprite" />
          ) : (
            <button
              type="button"
              className="photo-cat-drop"
              onClick={() => fileInputRef.current?.click()}
            >
              🐱
              <span>사진 선택하기</span>
            </button>
          )}
        </div>
        {busy && <p className="photo-cat-status">변신 중… 🪄</p>}
        {error && <p className="photo-cat-status photo-cat-error">{error}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {sprite && (
          <div className="photo-cat-controls">
            <button type="button" className="photo-cat-again" onClick={() => fileInputRef.current?.click()}>
              다른 사진 선택
            </button>
            <label className="photo-cat-toggle">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
              />
              배경 지우기
            </label>
          </div>
        )}

        <div className="plant-form">
          <label className="plant-label">고양이 이름</label>
          <input
            className="plant-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="우리집 냥이"
          />
          <label className="plant-label">
            한마디 <span className="plant-opt">(선택)</span>
          </label>
          <input
            className="plant-input"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={20}
            placeholder="예: 츄르만 먹는 애"
          />
        </div>

        <div className="share-row">
          <button className="btn-s" onClick={onClose}>취소</button>
          <button className="btn-p" onClick={handleSave} disabled={!sprite || busy}>
            놀이방에 풀어놓기 🐾
          </button>
        </div>
      </div>
    </div>
  );
}
