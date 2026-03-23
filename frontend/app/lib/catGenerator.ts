function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  return Math.abs(hash);
}

export function getCatPosition(index: number, total: number, seed: string): { x: number; y: number } {
  const h = hashCode(seed + index.toString());
  const x = 5 + (h % 85);
  const y = 15 + ((h >> 8) % 70);
  return { x, y };
}
