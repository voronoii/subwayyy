import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  calculatorMetadata, calculatorContentUpdatedAt, calculatorStructuredData,
  nutritionStructuredData, CALCULATOR_CONTENT_UPDATED_AT,
} from "../frontend/app/lib/calculatorSeo.ts";

const json = (name) => JSON.parse(readFileSync(new URL(`../frontend/app/data/${name}`, import.meta.url), "utf8"));
const weekly = json("_yundar-weekly.json");
const raw = json("_yundar.json");
const config = { id: "yundar", name: "윤달베이커리", layout: "catalog", weekly,
  categories: Object.entries(raw).map(([id, items]) => ({ id, label: id, icon: "", items })), nutritionKeys: [] };

test("weekly title and description use the published list and preserve the canonical URL", () => {
  const metadata = calculatorMetadata(config);
  assert.match(metadata.title.absolute, /주간 판매 메뉴/);
  assert.ok(metadata.description.includes(weekly.weekLabel));
  assert.ok(metadata.description.includes(`${weekly.available.length}종`));
  assert.ok(metadata.description.includes(weekly.updatedAt));
  assert.equal(metadata.alternates.canonical, "/calculator/yundar");
  assert.doesNotMatch(JSON.stringify(metadata), /도감|비건/);
});

test("the next weekly update updates descriptions and lastmod without a template edit", () => {
  const next = { ...config, weekly: { weekLabel: "2026년 10월 3주차", updatedAt: "2026-10-18", available: ["다음 회차 제품"] } };
  assert.match(calculatorMetadata(next).description, /10월 3주차 판매목록 1종, 2026-10-18/);
  assert.equal(calculatorContentUpdatedAt(next), "2026-10-18");
  assert.equal(calculatorStructuredData(next)["@graph"][0].dateModified, "2026-10-18");
});

test("older weekly data does not roll the actual content modification date backwards", () => {
  assert.equal(calculatorContentUpdatedAt({ ...config, weekly: { ...weekly, updatedAt: "2026-10-01" } }), CALCULATOR_CONTENT_UPDATED_AT);
});

test("all categories are represented in structured data, including non-default categories", () => {
  const graph = calculatorStructuredData(config)["@graph"];
  const list = graph.find((node) => node["@type"] === "ItemList");
  assert.equal(list.numberOfItems, Object.values(raw).flat().length);
  assert.equal(list.itemListElement.length, list.numberOfItems);
  for (const items of Object.values(raw)) assert.ok(list.itemListElement.some((row) => row.item.name === items.at(-1).name));
});

test("net carbs are not misrepresented as total carbohydrates", () => {
  const item = { name: "제품", calories: 100, protein: 4, sugar: 2, netCarbs: 20 };
  assert.equal(nutritionStructuredData(item).carbohydrateContent, undefined);
  assert.equal(nutritionStructuredData({ ...item, carbs: 27 }).carbohydrateContent, "27 g");
});

test("estimated or unavailable nutrition is not published as definite numbers", () => {
  const item = { name: "추정 제품", calories: 100, protein: 4, sugar: 2, nutritionNote: "다른 제품 기준 추정값" };
  assert.equal(nutritionStructuredData(item), undefined);
  assert.equal(nutritionStructuredData({ ...item, nutritionNote: undefined, noNutrition: true }), undefined);
  const row = calculatorStructuredData({ ...config, categories: [{ id: "a", label: "a", icon: "", items: [item] }] })["@graph"][2].itemListElement[0];
  assert.equal(row.item.description, item.nutritionNote);
  assert.equal(row.item.nutrition, undefined);
});

test("known zero is preserved while unknown and invalid values stay absent", () => {
  const nutrition = nutritionStructuredData({ name: "제품", calories: 100, protein: 0, sugar: 0, sodium: NaN });
  assert.equal(nutrition.proteinContent, "0 g");
  assert.equal(nutrition.sugarContent, "0 g");
  assert.equal(nutrition.fiberContent, undefined);
  assert.equal(nutrition.sodiumContent, undefined);
});
