import Link from "next/link";
import Calculator from "./Calculator";
import SavingsPageSchema from "../components/SavingsPageSchema";
import { PLANS, type Plan } from "../lib/policy";
import { savingsMetadata } from "../lib/seo";

export const metadata = savingsMetadata("calculator");

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const selected: Plan =
    plan && Object.hasOwn(PLANS, plan) ? (plan as Plan) : "standard";
  return (
    <>
      <SavingsPageSchema page="calculator" />
      <Calculator
        key={selected}
        initialPlan={selected}
        fromCheck={!!plan && Object.hasOwn(PLANS, plan)}
      />
      <section className="ys-section ys-guide" aria-labelledby="calculator-guide">
        <h2 id="calculator-guide">청년미래적금 계산기 사용 방법</h2>
        <ol>
          <li>월 납입액과 예상 가입유형을 선택하세요.</li>
          <li>취급기관에서 안내받은 은행 금리를 입력하세요.</li>
          <li>
            만기 예상 수령액을 원금·정부기여금·이자로 나누어 확인하고,
            같은 납입액으로 가입유형별 결과를 비교하세요.
          </li>
        </ol>
        <p>
          가입유형을 모른다면{" "}
          <Link href="/youth-savings/eligibility">가입조건 자가진단</Link>을 먼저
          이용하세요. 계산 결과는 납입 시점 등 화면에 안내된 가정에 따른 예상액이며,
          실제 지급액은 취급기관의 약관과 심사 결과에 따릅니다.
        </p>
      </section>
    </>
  );
}
