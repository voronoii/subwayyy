import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheIncr, cacheBackend } from "../../lib/cache";
import { isBot } from "../../lib/isBot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TTL = 60 * 60 * 24 * 60; // 일별 카운터 60일 보관

// 대시보드와 같은 Upstash 인스턴스를 공유하므로 키를 subwayyy: 로 분리한다.
const KEY_PREFIX = "subwayyy:visitors:";

// 집계 응답은 캐시하지 않는다(재방문자에게 오래된 수치 노출 방지).
const NO_STORE = { "Cache-Control": "no-store" };

// KST 기준 오늘 날짜 (YYYY-MM-DD)
function kstToday(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date()
  );
}

// GET /api/visitors        → 오늘 방문자 수 조회
// GET /api/visitors?hit=1  → +1 후 조회 (클라이언트가 localStorage 로 하루 1회만 호출)
//   · 봇/크롤러(User-Agent 기준)는 +1 하지 않고 현재 수치만 반환
//   · backend="memory" 로 응답되면 Upstash 미설정 상태(집계 신뢰 불가) 신호
export async function GET(req: NextRequest) {
  try {
    const date = kstToday();
    const key = `${KEY_PREFIX}${date}`;
    const wantHit = req.nextUrl.searchParams.get("hit") === "1";
    const bot = isBot(req.headers.get("user-agent"));
    let today: number;

    if (wantHit && !bot) {
      today = await cacheIncr(key, TTL);
    } else {
      today = Number((await cacheGet(key)) ?? "0");
    }

    return NextResponse.json(
      { date, today, backend: cacheBackend },
      { headers: NO_STORE }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown error" },
      { status: 500, headers: NO_STORE }
    );
  }
}
