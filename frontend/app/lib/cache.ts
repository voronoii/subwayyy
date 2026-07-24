// 간단한 KV 캐시. Upstash Redis(REST)가 설정돼 있으면 사용하고,
// 없으면 프로세스 메모리로 폴백한다. (방문자 카운터 용도)
// ⚠️ 프로덕션(Vercel)에서 UPSTASH_* env 가 없으면 인스턴스별 메모리로 폴백해
//    카운트가 무의미해진다. cacheBackend 로 상태를 노출한다.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// ── 메모리 폴백 ──────────────────────────────────────────────
type MemEntry = { value: string; expiresAt: number };
const mem = new Map<string, MemEntry>();

async function memGet(key: string): Promise<string | null> {
  const e = mem.get(key);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    mem.delete(key);
    return null;
  }
  return e.value;
}

async function memSet(key: string, value: string, ttlSec: number): Promise<void> {
  mem.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
}

// ── Upstash REST ────────────────────────────────────────────
async function upstash(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(UPSTASH_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash error ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`Upstash: ${json.error}`);
  return json.result ?? null;
}

// ── 공개 API ────────────────────────────────────────────────
export async function cacheGet(key: string): Promise<string | null> {
  if (!hasUpstash) return memGet(key);
  const r = await upstash(["GET", key]);
  return (r as string | null) ?? null;
}

// 원자적 증가 (방문자 카운터). 매 증가마다 만료를 보장한다.
export async function cacheIncr(key: string, ttlSec: number): Promise<number> {
  if (!hasUpstash) {
    const cur = Number((await memGet(key)) ?? "0") + 1;
    await memSet(key, String(cur), ttlSec);
    return cur;
  }
  const n = (await upstash(["INCR", key])) as number;
  // n===1 일 때만 EXPIRE 하면 그 한 번이 실패했을 때 키가 영구 잔존한다.
  // 날짜 키라 같은 날 내 TTL 재설정은 무해하며, 이후 어떤 hit 이든 만료를 다시 채운다.
  await upstash(["EXPIRE", key, ttlSec]);
  return n;
}

export const cacheBackend = hasUpstash ? "upstash" : "memory";
