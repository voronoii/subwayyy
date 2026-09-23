import type { Metadata } from "next";
import Calculator from "./Calculator";
import { PLANS, type Plan } from "../lib/policy";

export const metadata: Metadata = {
  title: "청년미래적금 만기 계산기 — 일반형·우대형 비교",
  description:
    "월 납입액과 은행 금리로 청년미래적금 3년 만기 예상 수령액을 계산하세요. 일반형 6%, 우대형 12%, 비과세형을 비교합니다.",
  alternates: { canonical: "/youth-savings/calculator" },
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const selected: Plan =
    plan && Object.hasOwn(PLANS, plan) ? (plan as Plan) : "standard";
  return (
    <Calculator
      key={selected}
      initialPlan={selected}
      fromCheck={!!plan && Object.hasOwn(PLANS, plan)}
    />
  );
}
