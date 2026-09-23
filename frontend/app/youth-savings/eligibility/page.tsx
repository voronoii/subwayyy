import type { Metadata } from "next";
import EligibilityCheck from "./EligibilityCheck";

export const metadata: Metadata = {
  title: "청년미래적금 대상자 확인 — 2차 가입조건 자가진단",
  description:
    "생년월일, 2025년 소득, 가구 조건으로 청년미래적금 일반형·우대형 가입 가능성을 확인하세요.",
  alternates: { canonical: "/youth-savings/eligibility" },
};
export default function EligibilityPage() {
  return <EligibilityCheck />;
}
