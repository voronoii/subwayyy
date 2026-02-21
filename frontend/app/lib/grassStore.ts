export interface GrassEntry {
  id: string;
  brandId: string;
  menuNames: string[];
  totalCalories: number;
  nickname: string;
  comment: string;
  timestamp: number;
}

const STORAGE_KEY = "subwayyy_grass";

const NICKNAMES = [
  "다이어트요정", "헬스요정", "칼로리계산러", "냥이집사", "샐러드러버",
  "단백질마스터", "건강지킴이", "식단관리사", "오운완", "벌크업중",
  "다이어터", "야식참는중", "점심고민러", "헬린이", "운동후한끼",
  "갓생러", "클린식단", "치팅데이", "저탄고지", "간헐적단식러",
];

export function getRandomNickname(): string {
  return NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

const DAY = 86400000;

const SEED: GrassEntry[] = [
  { id: "seed01", brandId: "subway", menuNames: ["에그마요", "허니오트", "아메리칸 치즈", "스위트 어니언"], totalCalories: 625, nickname: "다이어트요정", comment: "꿀조합이에요!", timestamp: Date.now() - DAY * 13 },
  { id: "seed02", brandId: "subway", menuNames: ["로스트 치킨", "위트", "모차렐라 치즈", "머스타드"], totalCalories: 489, nickname: "단백질러버", comment: "고단백 최고", timestamp: Date.now() - DAY * 12 },
  { id: "seed03", brandId: "subway", menuNames: ["터키", "플랫브레드", "핫칠리"], totalCalories: 396, nickname: "헬린이", comment: "저칼로리 굿", timestamp: Date.now() - DAY * 11 },
  { id: "seed04", brandId: "subway", menuNames: ["스테이크 & 치즈", "파마산 오레가노", "슈레드 치즈", "랜치"], totalCalories: 632, nickname: "벌크업중", comment: "운동 후 먹으면 최고", timestamp: Date.now() - DAY * 10 },
  { id: "seed05", brandId: "subway", menuNames: ["쉬림프", "위트", "머스타드"], totalCalories: 380, nickname: "갓생러", comment: "", timestamp: Date.now() - DAY * 9 },
  { id: "seed06", brandId: "subway", menuNames: ["치킨 데리야끼", "허니오트", "아메리칸 치즈", "허니머스타드"], totalCalories: 576, nickname: "점심고민러", comment: "매일 이거 먹음", timestamp: Date.now() - DAY * 8 },
  { id: "seed07", brandId: "subway", menuNames: ["베지", "위트"], totalCalories: 339, nickname: "클린식단", comment: "채소만으로도 충분", timestamp: Date.now() - DAY * 7 },
  { id: "seed08", brandId: "subway", menuNames: ["로티세리 바비큐 치킨", "화이트", "베이컨", "랜치"], totalCalories: 635, nickname: "치팅데이", comment: "가끔은 이렇게", timestamp: Date.now() - DAY * 6 },
  { id: "seed09", brandId: "subway", menuNames: ["참치", "위트", "아메리칸 치즈"], totalCalories: 498, nickname: "오운완", comment: "", timestamp: Date.now() - DAY * 5 },
  { id: "seed10", brandId: "subway", menuNames: ["이탈리안 비엠티", "허니오트", "슈레드 치즈", "스위트 어니언", "핫칠리"], totalCalories: 651, nickname: "야식참는중", comment: "이걸로 참았다", timestamp: Date.now() - DAY * 4 },

  { id: "seed11", brandId: "salady", menuNames: ["리코타 치즈 샐러드", "오리엔탈 드레싱"], totalCalories: 285, nickname: "샐러드러버", comment: "진짜 맛있어요", timestamp: Date.now() - DAY * 12 },
  { id: "seed12", brandId: "salady", menuNames: ["콥 샐러드", "시저 드레싱", "닭가슴살 토핑"], totalCalories: 380, nickname: "다이어터", comment: "단백질 보충!", timestamp: Date.now() - DAY * 10 },
  { id: "seed13", brandId: "salady", menuNames: ["연어 포케볼"], totalCalories: 445, nickname: "건강지킴이", comment: "", timestamp: Date.now() - DAY * 8 },
  { id: "seed14", brandId: "salady", menuNames: ["두부 샐러드", "발사믹 드레싱"], totalCalories: 220, nickname: "저탄고지", comment: "최저칼로리 조합", timestamp: Date.now() - DAY * 7 },
  { id: "seed15", brandId: "salady", menuNames: ["치킨 시저 랩", "콘스프"], totalCalories: 510, nickname: "간헐적단식러", comment: "하루 한 끼는 이걸로", timestamp: Date.now() - DAY * 5 },
  { id: "seed16", brandId: "salady", menuNames: ["그릭 샐러드", "레몬 드레싱", "아보카도 토핑"], totalCalories: 340, nickname: "칼로리계산러", comment: "균형 잡힌 한 끼", timestamp: Date.now() - DAY * 3 },
  { id: "seed17", brandId: "salady", menuNames: ["프로틴 박스", "오리엔탈 드레싱"], totalCalories: 420, nickname: "헬스요정", comment: "운동 전 먹기 좋아요", timestamp: Date.now() - DAY * 2 },

  { id: "seed18", brandId: "poke", menuNames: ["연어 포케", "백미밥", "아보카도", "스파이시 마요"], totalCalories: 580, nickname: "냥이집사", comment: "연어는 진리", timestamp: Date.now() - DAY * 11 },
  { id: "seed19", brandId: "poke", menuNames: ["참치 포케", "현미밥", "옥수수", "간장소스"], totalCalories: 490, nickname: "식단관리사", comment: "", timestamp: Date.now() - DAY * 9 },
  { id: "seed20", brandId: "poke", menuNames: ["새우 포케", "샐러드베이스", "망고", "폰즈소스"], totalCalories: 380, nickname: "다이어트요정", comment: "저칼로리 꿀조합!", timestamp: Date.now() - DAY * 6 },
  { id: "seed21", brandId: "poke", menuNames: ["훈제연어 포케", "백미밥", "크래미", "스리라차"], totalCalories: 620, nickname: "단백질마스터", comment: "든든해요", timestamp: Date.now() - DAY * 4 },
  { id: "seed22", brandId: "poke", menuNames: ["연어 포케", "현미밥", "에다마메", "와사비소스"], totalCalories: 510, nickname: "운동후한끼", comment: "오운완 후 포케 최고", timestamp: Date.now() - DAY * 1 },
  { id: "seed23", brandId: "subway", menuNames: ["에그마요", "위트", "머스타드"], totalCalories: 455, nickname: "헬린이", comment: "입문자 추천", timestamp: Date.now() - DAY * 3 },
  { id: "seed24", brandId: "salady", menuNames: ["닭가슴살 샐러드", "발사믹 드레싱"], totalCalories: 310, nickname: "갓생러", comment: "매일 점심 이거", timestamp: Date.now() - DAY * 1 },
  { id: "seed25", brandId: "poke", menuNames: ["참치 포케", "샐러드베이스", "아보카도", "폰즈소스"], totalCalories: 420, nickname: "저탄고지", comment: "탄수 없이도 맛있음", timestamp: Date.now() - DAY * 0.5 },
];

function getUserEntries(): GrassEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserEntries(entries: GrassEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getAllEntries(): GrassEntry[] {
  const user = getUserEntries();
  return [...SEED, ...user].sort((a, b) => a.timestamp - b.timestamp);
}

export function addEntry(input: {
  brandId: string;
  menuNames: string[];
  totalCalories: number;
  nickname: string;
  comment: string;
}): GrassEntry {
  const entry: GrassEntry = {
    id: uid(),
    ...input,
    timestamp: Date.now(),
  };
  const existing = getUserEntries();
  existing.push(entry);
  saveUserEntries(existing);
  return entry;
}

export function getGrassColor(calories: number): string {
  if (calories < 300) return "#9be9a8";
  if (calories < 500) return "#40c463";
  if (calories < 700) return "#30a14e";
  if (calories < 1000) return "#216e39";
  return "#0e4429";
}

export const BRAND_COLORS: Record<string, { body: string; dark: string; light: string }> = {
  subway: { body: "#34C759", dark: "#1B8A3E", light: "#8CE095" },
  salady: { body: "#FF9500", dark: "#CC7700", light: "#FFB84D" },
  poke: { body: "#5856D6", dark: "#3634A3", light: "#8886E5" },
};
