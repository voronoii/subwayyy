// 사진 → 픽셀 아트 변환 (전부 브라우저 안에서 처리, 서버 업로드 없음)

export interface PixelateOptions {
  grid?: number; // 픽셀 해상도 (grid x grid)
  removeBg?: boolean; // 가장자리에서 이어지는 배경색 제거
}

const DEFAULT_GRID = 26;
const BG_TOLERANCE = 52; // 배경 판정 색 거리
const POSTERIZE_LEVELS = 7; // 채널당 색 단계

function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러올 수 없어요"));
    };
    img.src = url;
  });
}

// 가장자리 픽셀에서 시작하는 flood fill로 배경 제거.
// 이웃끼리 비교하면 안티앨리어싱된 경계를 타고 피사체까지 번지므로,
// 항상 "시작한 테두리 픽셀의 색"을 기준으로 비교한다.
function removeBackground(data: Uint8ClampedArray, grid: number) {
  const removed = new Uint8Array(grid * grid);
  // [idx, seedR, seedG, seedB]
  const queue: Array<[number, number, number, number]> = [];

  const trySeed = (idx: number) => {
    if (removed[idx]) return;
    removed[idx] = 1;
    const o = idx * 4;
    queue.push([idx, data[o], data[o + 1], data[o + 2]]);
  };

  for (let i = 0; i < grid; i++) {
    trySeed(i); // top row
    trySeed(grid * (grid - 1) + i); // bottom row
    trySeed(grid * i); // left col
    trySeed(grid * i + (grid - 1)); // right col
  }

  while (queue.length > 0) {
    const [idx, sr, sg, sb] = queue.pop()!;
    const x = idx % grid;
    const y = (idx / grid) | 0;

    const neighbors = [
      x > 0 ? idx - 1 : -1,
      x < grid - 1 ? idx + 1 : -1,
      y > 0 ? idx - grid : -1,
      y < grid - 1 ? idx + grid : -1,
    ];
    for (const n of neighbors) {
      if (n < 0 || removed[n]) continue;
      const no = n * 4;
      if (colorDist(sr, sg, sb, data[no], data[no + 1], data[no + 2]) < BG_TOLERANCE) {
        removed[n] = 1;
        queue.push([n, sr, sg, sb]);
      }
    }
  }

  for (let i = 0; i < grid * grid; i++) {
    if (removed[i]) data[i * 4 + 3] = 0;
  }
}

// 채도 살짝 올리고 색 단계를 줄여서 픽셀 아트 느낌 내기
function posterize(data: Uint8ClampedArray) {
  const step = 255 / (POSTERIZE_LEVELS - 1);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // saturation boost
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const SAT = 1.2;
    r = Math.min(255, Math.max(0, gray + (r - gray) * SAT));
    g = Math.min(255, Math.max(0, gray + (g - gray) * SAT));
    b = Math.min(255, Math.max(0, gray + (b - gray) * SAT));

    data[i] = Math.round(r / step) * step;
    data[i + 1] = Math.round(g / step) * step;
    data[i + 2] = Math.round(b / step) * step;
    data[i + 3] = 255;
  }
}

// 투명 픽셀과 맞닿은 픽셀을 어둡게 → 스프라이트 외곽선 효과
function addOutline(data: Uint8ClampedArray, grid: number) {
  const isTransparent = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= grid || y >= grid) return true;
    return data[(y * grid + x) * 4 + 3] === 0;
  };
  const edges: number[] = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const idx = y * grid + x;
      if (data[idx * 4 + 3] === 0) continue;
      if (
        isTransparent(x - 1, y) ||
        isTransparent(x + 1, y) ||
        isTransparent(x, y - 1) ||
        isTransparent(x, y + 1)
      ) {
        edges.push(idx);
      }
    }
  }
  for (const idx of edges) {
    const o = idx * 4;
    data[o] = data[o] * 0.45;
    data[o + 1] = data[o + 1] * 0.45;
    data[o + 2] = data[o + 2] * 0.45;
  }
}

export async function pixelateImage(file: File, options: PixelateOptions = {}): Promise<string> {
  const grid = options.grid ?? DEFAULT_GRID;
  const removeBg = options.removeBg ?? true;

  const img = await loadImage(file);

  // 중앙 정사각형 크롭
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = grid;
  canvas.height = grid;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("캔버스를 사용할 수 없어요");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, side, side, 0, 0, grid, grid);

  const imageData = ctx.getImageData(0, 0, grid, grid);
  const data = imageData.data;

  if (removeBg) {
    removeBackground(data, grid);
  }
  posterize(data);
  if (removeBg) {
    addOutline(data, grid);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
