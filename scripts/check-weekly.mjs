#!/usr/bin/env node
/**
 * 주간 판매 목록(_yundar-weekly.json)이 도감(_yundar.json)과 맞는지 검증한다.
 *
 * 매주 판매 목록을 갈아끼운 뒤 커밋 전에 실행할 것:
 *   node scripts/check-weekly.mjs
 *
 * 이름이 하나라도 도감에 없으면 종료 코드 1로 실패한다. 화면에서는 이름이
 * 어긋나도 조용히 누락될 뿐이라, 여기서 잡지 않으면 알아채기 어렵다.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "frontend", "app", "data");

const readJson = (name) => JSON.parse(readFileSync(join(DATA_DIR, name), "utf8"));

/** 표기 흔들림(공백, 괄호, "삼각이" 접미사)을 걷어낸 비교용 키 */
const normalize = (name) => name.replace(/삼각이/g, "").replace(/[^\p{L}\p{N}]/gu, "");

const catalog = readJson("_yundar.json");
const weekly = readJson("_yundar-weekly.json");

const catalogNames = Object.values(catalog).flat().map((item) => item.name);
const byNormalized = new Map(catalogNames.map((name) => [normalize(name), name]));

const missing = [];
const looseMatches = [];
const seen = new Set();
const duplicates = [];

for (const name of weekly.available) {
  if (seen.has(name)) duplicates.push(name);
  seen.add(name);

  if (catalogNames.includes(name)) continue;

  const suggestion = byNormalized.get(normalize(name));
  if (suggestion) looseMatches.push({ name, suggestion });
  else missing.push(name);
}

console.log(`주간 목록: ${weekly.weekLabel} (${weekly.updatedAt}) — ${weekly.available.length}개`);
console.log(`도감: ${catalogNames.length}개\n`);

for (const { name, suggestion } of looseMatches) {
  console.error(`⚠️  표기 불일치: "${name}" → 도감에는 "${suggestion}"`);
}
for (const name of duplicates) {
  console.error(`⚠️  중복: "${name}"`);
}
for (const name of missing) {
  console.error(`❌ 도감에 없음: "${name}"`);
}

const problems = looseMatches.length + duplicates.length + missing.length;
if (problems > 0) {
  console.error(`\n${problems}건을 고쳐야 한다. 도감에 없는 제품이면 _yundar.json에 먼저 추가할 것.`);
  process.exit(1);
}

console.log("✅ 주간 목록의 모든 이름이 도감과 정확히 일치한다.");
