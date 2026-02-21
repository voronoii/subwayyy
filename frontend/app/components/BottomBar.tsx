"use client";

interface BottomBarProps {
  totalKcal: number;
  onShowResult: () => void;
}

export default function BottomBar({ totalKcal, onShowResult }: BottomBarProps) {
  return (
    <div className="bot-bar">
      <div className="info">
        <div className="lbl">총 칼로리</div>
        <div className="val">
          {Math.round(totalKcal)} <span className="unit">kcal</span>
        </div>
      </div>
      <button className="cta" onClick={onShowResult}>
        결과 보기
      </button>
    </div>
  );
}
