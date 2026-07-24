"use client";

import { useEffect, useRef, useState } from "react";

// KST 기준 오늘 날짜 (서버 카운터 키와 동일 기준)
function kstToday(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date()
  );
}

export default function VisitorBadge() {
  const [count, setCount] = useState<number | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    // StrictMode(dev) 이중 실행 및 재마운트로 인한 중복 호출 방지
    if (ranRef.current) return;
    ranRef.current = true;

    const flagKey = `subwayyy:visited:${kstToday()}`;
    let alreadyVisited = false;
    try {
      alreadyVisited = localStorage.getItem(flagKey) === "1";
    } catch {
      // 시크릿 모드/스토리지 차단 — 조회만 (중복 방지 불가하므로 hit 하지 않음)
      alreadyVisited = true;
    }

    fetch(`/api/visitors${alreadyVisited ? "" : "?hit=1"}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || typeof d.today !== "number") return;
        setCount(d.today);
        // 증가가 실제로 성공한 뒤에만 오늘 방문 플래그 저장.
        // (fetch 전에 저장하면 요청 실패 시 그 방문자가 오늘 영구 미집계됨)
        if (!alreadyVisited) {
          try {
            localStorage.setItem(flagKey, "1");
          } catch {
            /* 저장 불가 — 다음 로드에서 다시 hit 될 수 있으나 무해 */
          }
        }
      })
      .catch(() => {});
  }, []);

  if (count === null) return null;

  return (
    <p className="visitor-badge">
      오늘 방문 <strong>{count.toLocaleString("ko-KR")}</strong>
    </p>
  );
}
