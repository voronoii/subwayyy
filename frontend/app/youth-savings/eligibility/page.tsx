import Link from "next/link";
import EligibilityCheck from "./EligibilityCheck";
import SavingsPageSchema from "../components/SavingsPageSchema";
import { POLICY } from "../lib/policy";
import { savingsMetadata } from "../lib/seo";

export const metadata = savingsMetadata("eligibility");

export default function EligibilityPage() {
  return (
    <>
      <SavingsPageSchema page="eligibility" />
      <EligibilityCheck />
      <section
        className="ys-section ys-guide ys-check-shell"
        aria-labelledby="eligibility-guide"
      >
        <h2 id="eligibility-guide">청년미래적금 가입조건, 무엇을 확인하나요?</h2>
        <p>
          나이만으로 가입 여부가 정해지지는 않습니다. 개인소득과 가구소득,
          현재 근로·사업 상태, 기존 정책계좌 가입 이력을 함께 확인합니다.
          이 자가진단은 다음 네 단계를 거쳐 예상 가입유형을 안내합니다.
        </p>
        <ol>
          <li>기본 정보: 생년월일, 병역 이행 기간과 국내 거주 여부</li>
          <li>개인소득: 소득 종류·금액, 중소기업 재직 여부 또는 사업 매출</li>
          <li>가구소득: 가구원 수, 가구 전체 소득과 맞벌이 해당 여부</li>
          <li>마지막 확인: 금융소득 종합과세 이력과 기존 정책계좌 가입 상태</li>
        </ol>
        <p>
          입력한 조건에 따라 일반형·우대형·비과세형의 가능성과 추가 확인이
          필요한 항목을 표시합니다. 결과를 확인한 뒤에는{" "}
          <Link href="/youth-savings/calculator">만기 계산기</Link>로 납입 계획을
          비교할 수 있습니다.
        </p>
        <p>
          최종 가입 여부와 유형은 취급기관의 심사로 확정됩니다.{" "}
          <a href={POLICY.sources.product} target="_blank" rel="noreferrer">
            서민금융진흥원 공식 상품 안내
          </a>
          에서 상세 조건을 확인하세요.
        </p>
      </section>
    </>
  );
}
