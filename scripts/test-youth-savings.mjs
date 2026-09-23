import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSavings,
  evaluateEligibility,
  householdLimit,
  EMPTY_ANSWERS,
} from "../frontend/app/youth-savings/lib/policy.ts";

const base = {
  ...EMPTY_ANSWERS,
  birthDate: "1998-01-01",
  resident: "yes",
  nationality: "korean",
  financialTax: "no",
  account: "none",
  incomeKind: "salary",
  income: "3500",
  sme: "no",
  householdSize: "1",
  householdIncome: "3500",
  householdKnown: "yes",
};
const check = (changes) => evaluateEligibility({ ...base, ...changes });
test("monthly 500k at 8% preferred: principal + grant + separately calculated interest", () => {
  assert.deepEqual(calculateSavings(500000, 8, "preferential"), {
    principal: 18000000,
    contribution: 2160000,
    interest: 2220000,
    contributionInterest: 166500,
    total: 22546500,
  });
});
test("standard 7% matches the official roughly 21.10m illustration", () =>
  assert.equal(calculateSavings(500000, 7, "standard").total, 21105750));
test("tax-only gets no government principal or government interest", () => {
  assert.deepEqual(calculateSavings(500000, 5, "taxOnly"), {
    principal: 18000000,
    contribution: 0,
    interest: 1387500,
    contributionInterest: 0,
    total: 19387500,
  });
});
test("minimum payment and zero interest remain finite", () =>
  assert.equal(calculateSavings(1000, 0, "taxOnly").total, 36000));
test("invalid money/rates/plans never produce a misleading result", () => {
  for (const n of [0, 999, 1001, 500001, -1, NaN, Infinity])
    assert.throws(() => calculateSavings(n, 5, "standard"), RangeError);
  for (const n of [-1, 8.1, NaN, Infinity])
    assert.throws(() => calculateSavings(500000, n, "standard"), RangeError);
  assert.throws(() => calculateSavings(500000, 5, "__proto__"), RangeError);
});
test("default salaried applicant qualifies for standard", () =>
  assert.equal(check({}).plan, "standard"));
test("salary 36m exact boundary preferred for existing SME", () => {
  assert.equal(
    check({
      income: "3600",
      householdIncome: "3600",
      sme: "yes",
      newcomer: "no",
    }).plan,
    "preferential",
  );
  assert.equal(
    check({
      income: "3600.0001",
      householdIncome: "3600.0001",
      sme: "yes",
      newcomer: "no",
    }).plan,
    "standard",
  );
});
test("new SME employee can receive preferred at 60m, only tax relief above", () => {
  const x = {
    income: "6000",
    householdIncome: "6000",
    householdSize: "3",
    sme: "yes",
    newcomer: "yes",
  };
  assert.equal(check(x).plan, "preferential");
  assert.equal(
    check({ ...x, income: "6000.0001", householdIncome: "6000.0001" }).plan,
    "taxOnly",
  );
});
test("salary ceiling is inclusive at 75m", () => {
  const x = { income: "7500", householdIncome: "7500", householdSize: "3" };
  assert.equal(check(x).plan, "taxOnly");
  assert.equal(
    check({ ...x, income: "7500.0001", householdIncome: "7500.0001" }).status,
    "ineligible",
  );
});
test("comprehensive income thresholds use 26m/48m/63m", () => {
  const x = {
    incomeKind: "comprehensive",
    householdSize: "3",
    householdIncome: "6300",
  };
  assert.equal(
    check({ ...x, income: "2600", sme: "yes", newcomer: "no" }).plan,
    "preferential",
  );
  assert.equal(check({ ...x, income: "4800" }).plan, "standard");
  assert.equal(check({ ...x, income: "4800.0001" }).plan, "taxOnly");
  assert.equal(
    check({ ...x, income: "6300.0001", householdIncome: "6300.0001" }).status,
    "ineligible",
  );
});
test("sole trader revenue and income routes both considered", () => {
  const x = { incomeKind: "business", income: "3500", sales: "10000" };
  assert.equal(check(x).plan, "preferential");
  assert.equal(check({ ...x, sales: "10000.0001" }).plan, "standard");
  assert.equal(check({ ...x, sales: "30000" }).plan, "standard");
  assert.equal(check({ ...x, sales: "30001" }).plan, "standard");
  assert.equal(
    check({
      ...x,
      sales: "30001",
      income: "6000",
      householdSize: "3",
      householdIncome: "6000",
    }).plan,
    "taxOnly",
  );
});
test("annual household table and inclusive thresholds are exact to won", () => {
  assert.equal(householdLimit(1, 150), 43056234);
  assert.equal(householdLimit(2, 250), 117979740);
  assert.equal(householdLimit(9, 200), null);
  assert.equal(check({ householdIncome: "5740.8312" }).status, "eligible");
  assert.equal(check({ householdIncome: "5740.8313" }).status, "ineligible");
});
test("dual-income married couple raises standard and preferred limits", () => {
  const x = { householdSize: "2", householdIncome: "10000", dualIncome: "yes" };
  assert.equal(check(x).plan, "standard");
  assert.equal(check({ ...x, dualIncome: "no" }).status, "ineligible");
  assert.equal(
    check({ ...x, householdIncome: "9000", sme: "yes", newcomer: "no" }).plan,
    "preferential",
  );
  assert.equal(
    check({
      ...x,
      householdIncome: "9000",
      sme: "yes",
      newcomer: "no",
      dualIncome: "no",
    }).plan,
    "standard",
  );
});
test("uncertain facts never become an eligible result", () => {
  for (const x of [
    { sme: "unknown" },
    { householdKnown: "unknown" },
    { householdSize: "9" },
    { financialTax: "unknown" },
    { incomeKind: "special" },
    { incomeKind: "mixed" },
    { account: "rejoin" },
    { resident: "unknown" },
    { householdIncome: "100" },
  ])
    assert.equal(check(x).status, "review", JSON.stringify(x));
});
test("hard exclusions cover missing income, tax, duplicate and matured accounts", () => {
  for (const x of [
    { incomeKind: "none" },
    { financialTax: "yes" },
    { account: "future" },
    { account: "matured" },
    { resident: "no" },
  ])
    assert.equal(check(x).status, "ineligible", JSON.stringify(x));
});
test("foreign resident receives no grant, active leap account can switch", () => {
  assert.equal(
    check({ nationality: "foreign", sme: "yes", newcomer: "yes" }).plan,
    "taxOnly",
  );
  const r = check({ account: "leap" });
  assert.equal(r.plan, "standard");
  assert.match(r.notes.join(" "), /갈아타기/);
});
test("opening-date birthday boundary and military exceptions", () => {
  assert.equal(check({ birthDate: "1991-11-16" }).status, "ineligible");
  assert.equal(check({ birthDate: "1991-11-17" }).status, "eligible");
  assert.match(check({ birthDate: "1991-11-17" }).notes.join(" "), /생일 전날/);
  assert.equal(check({ birthDate: "2007-11-27" }).status, "eligible");
  assert.equal(check({ birthDate: "2007-11-28" }).status, "ineligible");
  assert.equal(
    check({ birthDate: "1990-11-17", militaryMonths: "18" }).status,
    "review",
  );
  assert.equal(check({ birthDate: "1999-02-30" }).status, "review");
});
