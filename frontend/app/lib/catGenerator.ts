function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  return Math.abs(hash);
}

export function getCatPosition(index: number, total: number, seed: string): { x: number; y: number } {
  // 잔디밭 영역(세로 58~90%) 안에서만 배치 — useCatSimulation의 BOUNDS와 맞춤
  const h = hashCode(seed + index.toString());
  const x = 8 + (h % 85);
  const y = 58 + ((h >> 8) % 33);
  return { x, y };
}
