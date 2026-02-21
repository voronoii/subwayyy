"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addEntry, getRandomNickname } from "../lib/grassStore";

interface PlantModalProps {
  open: boolean;
  onClose: () => void;
  brandId: string;
  menuNames: string[];
  totalCalories: number;
}

export default function PlantModal({ open, onClose, brandId, menuNames, totalCalories }: PlantModalProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState(() => getRandomNickname());
  const [comment, setComment] = useState("");

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handlePlant = useCallback(() => {
    addEntry({
      brandId,
      menuNames,
      totalCalories,
      nickname: nickname.trim() || getRandomNickname(),
      comment: comment.trim(),
    });
    sessionStorage.setItem("grassJustPlanted", "true");
    router.push("/grass");
  }, [brandId, menuNames, totalCalories, nickname, comment, router]);

  return (
    <div className={`overlay${open ? " open" : ""}`} onClick={handleOverlayClick}>
      <div className="sheet">
        <div className="handle" />
        <h2>메뉴 심기 🌱</h2>
        <div className="plant-summary">
          {menuNames.join(" + ")}
          <span className="plant-kcal">{Math.round(totalCalories)}kcal</span>
        </div>
        <div className="plant-form">
          <label className="plant-label">닉네임</label>
          <input
            className="plant-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
            placeholder="닉네임"
          />
          <label className="plant-label">한줄 리뷰 <span className="plant-opt">(선택)</span></label>
          <input
            className="plant-input"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={20}
            placeholder="이 조합 어때요?"
          />
        </div>
        <div className="share-row">
          <button className="btn-s" onClick={onClose}>취소</button>
          <button className="btn-p" onClick={handlePlant}>심기 🌱</button>
        </div>
      </div>
    </div>
  );
}
