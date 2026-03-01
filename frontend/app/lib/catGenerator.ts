export interface CatPalette {
  fur: string;
  dark: string;
  light: string;
  belly: string;
}

const PALETTES: CatPalette[] = [
  { fur: "#6EC87A", dark: "#3E9A4E", light: "#A8E6B0", belly: "#E8F8EC" },
  { fur: "#FFA94D", dark: "#CC7A1F", light: "#FFD19A", belly: "#FFF3E0" },
  { fur: "#9B8FE8", dark: "#6C5FC7", light: "#C4BFEF", belly: "#EDEAFF" },
  { fur: "#F5DEB3", dark: "#D4B483", light: "#FFF5E1", belly: "#FFFDF7" },
  { fur: "#FFB4C2", dark: "#E8899A", light: "#FFD6E0", belly: "#FFF0F3" },
  { fur: "#87CEEB", dark: "#5BA3C7", light: "#B8E4F7", belly: "#EEF8FF" },
  { fur: "#5C5C6E", dark: "#3A3A4A", light: "#8888A0", belly: "#E8E8EE" },
  { fur: "#E8A04C", dark: "#C07A28", light: "#F5C882", belly: "#FFF5E6" },
];

const BRAND_PALETTE: Record<string, number> = { subway: 0, salady: 1, poke: 2 };

type BodyShape = "round" | "slim" | "chubby" | "kitten" | "loaf";
type Accessory = "none" | "ribbon" | "scarf" | "hat" | "glasses";
type Pose = "sit" | "stand" | "walk" | "sleep" | "wave";
type Expression = "happy" | "sleepy" | "wink" | "surprised" | "smug";

const BODY_SHAPES: BodyShape[] = ["round", "slim", "chubby", "kitten", "loaf"];
const ACCESSORIES: Accessory[] = ["none", "ribbon", "scarf", "hat", "glasses"];
const POSES: Pose[] = ["sit", "stand", "walk", "sleep", "wave"];
const EXPRESSIONS: Expression[] = ["happy", "sleepy", "wink", "surprised", "smug"];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash + c) | 0;
  }
  return Math.abs(hash);
}

export interface CatTraits {
  palette: CatPalette;
  paletteIndex: number;
  body: BodyShape;
  accessory: Accessory;
  pose: Pose;
  expression: Expression;
}

export function getCatTraits(entryId: string, brandId: string): CatTraits {
  const h = hashCode(entryId);
  const basePalette = BRAND_PALETTE[brandId] ?? 0;
  // 70% brand color, 30% random — keeps brand identity while adding diversity
  const useRandom = (h % 100) >= 70;
  const paletteIndex = useRandom
    ? (h >> 4) % PALETTES.length
    : basePalette;

  return {
    palette: PALETTES[paletteIndex],
    paletteIndex,
    body: BODY_SHAPES[(h >> 8) % BODY_SHAPES.length],
    accessory: ACCESSORIES[(h >> 12) % ACCESSORIES.length],
    pose: POSES[(h >> 16) % POSES.length],
    expression: EXPRESSIONS[(h >> 20) % EXPRESSIONS.length],
  };
}

function renderEars(p: CatPalette, body: BodyShape): string {
  if (body === "loaf") {
    return `
      <polygon points="6,6 8,2 10,6" fill="${p.fur}" stroke="${p.dark}" stroke-width="0.5"/>
      <polygon points="22,6 24,2 26,6" fill="${p.fur}" stroke="${p.dark}" stroke-width="0.5"/>
      <polygon points="7,5.5 8,3 9,5.5" fill="${p.light}"/>
      <polygon points="23,5.5 24,3 25,5.5" fill="${p.light}"/>
    `;
  }
  const earH = body === "kitten" ? 1 : 2;
  return `
    <polygon points="7,8 9,${earH} 12,7" fill="${p.fur}" stroke="${p.dark}" stroke-width="0.5"/>
    <polygon points="20,7 23,${earH} 25,8" fill="${p.fur}" stroke="${p.dark}" stroke-width="0.5"/>
    <polygon points="8.5,7 9.5,${earH + 1.5} 11,7" fill="${p.light}"/>
    <polygon points="21,7 22.5,${earH + 1.5} 23.5,7" fill="${p.light}"/>
  `;
}

function renderHead(p: CatPalette, body: BodyShape): string {
  if (body === "kitten") {
    return `<ellipse cx="16" cy="11" rx="7" ry="6" fill="${p.fur}"/>`;
  }
  if (body === "slim") {
    return `<ellipse cx="16" cy="11" rx="7.5" ry="5.5" fill="${p.fur}"/>`;
  }
  const rx = body === "chubby" ? 8.5 : body === "loaf" ? 8 : 8;
  return `<ellipse cx="16" cy="11" rx="${rx}" ry="6.5" fill="${p.fur}"/>`;
}

function renderEyes(expr: Expression): string {
  switch (expr) {
    case "happy":
      return `
        <ellipse cx="12" cy="11" rx="1.5" ry="1.8" fill="#1A1A1A"/>
        <ellipse cx="20" cy="11" rx="1.5" ry="1.8" fill="#1A1A1A"/>
        <circle cx="12.6" cy="10.2" r="0.6" fill="#fff"/>
        <circle cx="20.6" cy="10.2" r="0.6" fill="#fff"/>
      `;
    case "sleepy":
      return `
        <line x1="10" y1="11" x2="14" y2="11" stroke="#1A1A1A" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="18" y1="11" x2="22" y2="11" stroke="#1A1A1A" stroke-width="1.2" stroke-linecap="round"/>
      `;
    case "wink":
      return `
        <ellipse cx="12" cy="11" rx="1.5" ry="1.8" fill="#1A1A1A"/>
        <circle cx="12.6" cy="10.2" r="0.6" fill="#fff"/>
        <path d="M18,11 Q20,9.5 22,11" stroke="#1A1A1A" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      `;
    case "surprised":
      return `
        <circle cx="12" cy="11" r="2" fill="#1A1A1A"/>
        <circle cx="20" cy="11" r="2" fill="#1A1A1A"/>
        <circle cx="12.5" cy="10.3" r="0.8" fill="#fff"/>
        <circle cx="20.5" cy="10.3" r="0.8" fill="#fff"/>
      `;
    case "smug":
      return `
        <ellipse cx="12" cy="11" rx="1.5" ry="1" fill="#1A1A1A"/>
        <ellipse cx="20" cy="11" rx="1.5" ry="1" fill="#1A1A1A"/>
        <circle cx="12.6" cy="10.6" r="0.5" fill="#fff"/>
        <circle cx="20.6" cy="10.6" r="0.5" fill="#fff"/>
      `;
  }
}

function renderMouth(expr: Expression): string {
  switch (expr) {
    case "happy":
      return `<path d="M14,14 Q16,16 18,14" stroke="#1A1A1A" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
    case "sleepy":
      return `<ellipse cx="16" cy="14.5" rx="1" ry="0.6" fill="#1A1A1A"/>`;
    case "wink":
      return `<path d="M14,14 Q16,15.5 18,14" stroke="#1A1A1A" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
    case "surprised":
      return `<ellipse cx="16" cy="15" rx="1.5" ry="1.2" fill="#1A1A1A"/><ellipse cx="16" cy="14.8" rx="1" ry="0.7" fill="#E87070"/>`;
    case "smug":
      return `<path d="M14,14 Q15,15 16,14.2 Q17,15 18,14" stroke="#1A1A1A" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
  }
}

function renderNose(): string {
  return `<polygon points="15.2,13 16.8,13 16,14" fill="#FFB4C2"/>`;
}

function renderWhiskers(): string {
  return `
    <line x1="5" y1="12" x2="10" y2="12.5" stroke="#C7C7CC" stroke-width="0.5" stroke-linecap="round"/>
    <line x1="5" y1="14" x2="10" y2="13.5" stroke="#C7C7CC" stroke-width="0.5" stroke-linecap="round"/>
    <line x1="27" y1="12" x2="22" y2="12.5" stroke="#C7C7CC" stroke-width="0.5" stroke-linecap="round"/>
    <line x1="27" y1="14" x2="22" y2="13.5" stroke="#C7C7CC" stroke-width="0.5" stroke-linecap="round"/>
  `;
}

function renderBody(p: CatPalette, body: BodyShape, pose: Pose): string {
  if (pose === "sleep") {
    return `
      <ellipse cx="16" cy="24" rx="10" ry="5" fill="${p.fur}"/>
      <ellipse cx="16" cy="24.5" rx="6" ry="3" fill="${p.belly}"/>
    `;
  }
  if (pose === "walk") {
    const w = body === "chubby" ? 9 : body === "slim" ? 6.5 : body === "kitten" ? 6 : 7.5;
    return `
      <ellipse cx="16" cy="23" rx="${w}" ry="6" fill="${p.fur}"/>
      <ellipse cx="16" cy="24" rx="${w - 2}" ry="3.5" fill="${p.belly}"/>
    `;
  }
  const w = body === "chubby" ? 9.5 : body === "slim" ? 6.5 : body === "kitten" ? 6 : body === "loaf" ? 10 : 8;
  const h = body === "loaf" ? 5 : 6.5;
  return `
    <ellipse cx="16" cy="23" rx="${w}" ry="${h}" fill="${p.fur}"/>
    <ellipse cx="16" cy="24" rx="${w - 2}" ry="${h - 2.5}" fill="${p.belly}"/>
  `;
}

function renderLegs(p: CatPalette, pose: Pose, body: BodyShape): string {
  if (body === "loaf" || pose === "sleep") return "";

  if (pose === "walk") {
    return `
      <rect x="10" y="27" width="3" height="4" rx="1" fill="${p.dark}"/>
      <rect x="19" y="26" width="3" height="5" rx="1" fill="${p.dark}"/>
    `;
  }
  return `
    <rect x="10" y="27" width="3" height="4" rx="1" fill="${p.dark}"/>
    <rect x="19" y="27" width="3" height="4" rx="1" fill="${p.dark}"/>
  `;
}

function renderTail(p: CatPalette, pose: Pose): string {
  if (pose === "sleep") {
    return `<path d="M26,24 Q30,22 28,19" stroke="${p.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  if (pose === "walk") {
    return `<path d="M26,20 Q30,16 28,12" stroke="${p.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  if (pose === "wave") {
    return `<path d="M25,21 Q30,14 27,10" stroke="${p.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
  return `<path d="M25,22 Q29,18 27,14" stroke="${p.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
}

function renderAccessory(acc: Accessory): string {
  switch (acc) {
    case "none":
      return "";
    case "ribbon":
      return `
        <circle cx="23" cy="6" r="2.5" fill="#FF6B8A"/>
        <circle cx="23" cy="6" r="1" fill="#FF8FAA"/>
      `;
    case "scarf":
      return `
        <path d="M8,16 Q16,19 24,16 Q24,18 23,19 Q16,21 9,19 Q8,18 8,16Z" fill="#FF6B6B" opacity="0.9"/>
        <rect x="22" y="17" width="2.5" height="5" rx="1" fill="#FF6B6B" opacity="0.9"/>
      `;
    case "hat":
      return `
        <rect x="10" y="3" width="12" height="4" rx="1.5" fill="#FFD93D"/>
        <rect x="8" y="6.5" width="16" height="2" rx="1" fill="#FFD93D"/>
        <rect x="11" y="4" width="3" height="2" rx="0.5" fill="#FF8C42"/>
      `;
    case "glasses":
      return `
        <circle cx="12" cy="11" r="3" fill="none" stroke="#1A1A1A" stroke-width="0.8"/>
        <circle cx="20" cy="11" r="3" fill="none" stroke="#1A1A1A" stroke-width="0.8"/>
        <line x1="15" y1="11" x2="17" y2="11" stroke="#1A1A1A" stroke-width="0.8"/>
        <line x1="7" y1="10.5" x2="9" y2="11" stroke="#1A1A1A" stroke-width="0.8"/>
        <line x1="25" y1="10.5" x2="23" y2="11" stroke="#1A1A1A" stroke-width="0.8"/>
      `;
  }
}

function renderCheeks(expr: Expression): string {
  if (expr === "happy" || expr === "wink" || expr === "smug") {
    return `
      <circle cx="9" cy="13" r="1.5" fill="#FFB4C2" opacity="0.5"/>
      <circle cx="23" cy="13" r="1.5" fill="#FFB4C2" opacity="0.5"/>
    `;
  }
  return "";
}

function renderWavePaw(pose: Pose, p: CatPalette): string {
  if (pose !== "wave") return "";
  return `
    <rect x="6" y="18" width="3" height="4" rx="1" fill="${p.fur}" transform="rotate(-30,7.5,20)"/>
    <ellipse cx="6" cy="17.5" rx="1.8" ry="1.5" fill="${p.light}" transform="rotate(-30,6,17.5)"/>
  `;
}

export function generateCatSVG(traits: CatTraits): string {
  const { palette: p, body, accessory, pose, expression } = traits;

  const sleepOffset = pose === "sleep" ? 'transform="translate(0,4)"' : "";

  return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
  <g ${sleepOffset}>
    ${renderTail(p, pose)}
    ${renderBody(p, body, pose)}
    ${renderLegs(p, pose, body)}
    ${renderEars(p, body)}
    ${renderHead(p, body)}
    ${renderEyes(expression)}
    ${renderNose()}
    ${renderMouth(expression)}
    ${renderWhiskers()}
    ${renderCheeks(expression)}
    ${renderWavePaw(pose, p)}
    ${renderAccessory(accessory)}
  </g>
</svg>`;
}

export function getCatAnimationClass(pose: Pose): string {
  switch (pose) {
    case "walk":
      return "cat-anim-walk";
    case "sleep":
      return "cat-anim-sleep";
    case "wave":
      return "cat-anim-wave";
    case "sit":
      return "cat-anim-sit";
    case "stand":
    default:
      return "cat-anim-idle";
  }
}

export function getCatPosition(index: number, total: number, seed: string): { x: number; y: number } {
  const h = hashCode(seed + index.toString());
  const x = 5 + (h % 85);
  const y = 15 + ((h >> 8) % 70);
  return { x, y };
}
