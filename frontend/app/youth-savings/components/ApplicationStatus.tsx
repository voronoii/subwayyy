"use client";
import { useEffect, useState } from "react";

export default function ApplicationStatus() {
  const [today, setToday] = useState("");
  useEffect(() => {
    const update = () =>
      setToday(
        new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
          new Date(),
        ),
      );
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  let label = "2026년 2차 모집";
  if (today && today < "2026-10-07") label = "2차 모집 · 신청 예정";
  else if (today === "2026-10-07") label = "오늘 신청 · 출생연도 끝자리 홀수";
  else if (today === "2026-10-08") label = "오늘 신청 · 출생연도 끝자리 짝수";
  else if (today >= "2026-10-09" && today <= "2026-10-11")
    label = "10월 12일부터 신청 재개";
  else if (today >= "2026-10-12" && today <= "2026-10-16")
    label = "전체 신청 기간";
  else if (today >= "2026-10-17" && today < "2026-11-16")
    label = "신청 마감 · 심사 진행";
  else if (today >= "2026-11-16" && today <= "2026-11-27")
    label = "심사 통과자 계좌 개설 기간";
  else if (today > "2026-11-27") label = "2026년 2차 모집 종료";
  return (
    <span className="ys-status">
      <span aria-hidden="true" />
      {label}
    </span>
  );
}
