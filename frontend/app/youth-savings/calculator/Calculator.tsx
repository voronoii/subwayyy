"use client";
import { useState } from "react";
import Link from "next/link";
import PreferredGuide from "../components/PreferredGuide";
import { calculateSavings, PLANS, POLICY, won, type Plan } from "../lib/policy";

export default function Calculator({
  initialPlan,
  fromCheck,
}: {
  initialPlan: Plan;
  fromCheck: boolean;
}) {
  const [monthly, setMonthly] = useState("500000");
  const [rate, setRate] = useState("5");
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const amount = Number(monthly);
  const annualRate = Number(rate);
  const amountValid =
    monthly !== "" &&
    Number.isFinite(amount) &&
    amount >= 1000 &&
    amount <= 500000 &&
    amount % 1000 === 0;
  const rateValid =
    rate !== "" &&
    Number.isFinite(annualRate) &&
    annualRate >= 0 &&
    annualRate <= 8;
  const valid = amountValid && rateValid;
  const result = valid ? calculateSavings(amount, annualRate, plan) : null;
  return (
    <>
      <div className="ys-page-intro">
        <Link href="/youth-savings" className="ys-back">
          ‹ 신청 안내
        </Link>
        <h1>
          매달의 저축이,
          <br />
          3년 뒤 얼마가 될까요?
        </h1>
        <p>납입액과 가입유형을 바꿔 나만의 저축 계획을 세워보세요.</p>
      </div>
      {fromCheck && (
        <div className="ys-notice">
          자가진단에서 확인한 <strong>{PLANS[initialPlan].label}</strong>을
          선택했어요. 최종 유형은 공식 심사에서 확정됩니다.
        </div>
      )}
      <div className="ys-calculator-grid">
        <div className="ys-input-panel">
          <fieldset className="ys-fieldset">
            <legend>매달 얼마씩 넣을까요?</legend>
            <div className="ys-money-input">
              <input
                id="monthly-deposit"
                aria-label="월 납입액"
                aria-describedby="monthly-help"
                aria-invalid={!amountValid}
                type="number"
                inputMode="numeric"
                min="1000"
                max="500000"
                step="1000"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              />
              <span>원</span>
            </div>
            <input
              className="ys-range"
              aria-label="월 납입액 슬라이더"
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={amountValid ? amount : 1000}
              onChange={(e) => setMonthly(e.target.value)}
            />
            <div className="ys-range-labels">
              <span>1천원</span>
              <span>50만원</span>
            </div>
            <div className="ys-quick-amounts">
              {[100000, 200000, 300000, 500000].map((n) => (
                <button
                  key={n}
                  aria-pressed={amount === n}
                  onClick={() => setMonthly(String(n))}
                >
                  {n / 10000}만원
                </button>
              ))}
            </div>
            <p
              id="monthly-help"
              className={amountValid ? "ys-fine" : "ys-error"}
            >
              {amountValid
                ? "매월 같은 금액을 36개월 납입하는 것으로 계산해요."
                : "1,000원부터 500,000원까지 1,000원 단위로 입력해 주세요."}
            </p>
          </fieldset>
          <fieldset className="ys-fieldset">
            <legend>가입유형을 선택하세요</legend>
            <div className="ys-plan-options">
              {(Object.keys(PLANS) as Plan[]).map((key) => (
                <label key={key} className={plan === key ? "selected" : ""}>
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={plan === key}
                    onChange={() => setPlan(key)}
                  />
                  <span>
                    <strong>{PLANS[key].label}</strong>
                    <small>{PLANS[key].caption}</small>
                  </span>
                  <b>
                    {Math.round(PLANS[key].rate * 100)}
                    <small>%</small>
                  </b>
                </label>
              ))}
            </div>
            <p className="ys-fine">
              유형을 모르겠다면{" "}
              <Link href="/youth-savings/eligibility">대상자 확인</Link>부터
              해보세요.
            </p>
          </fieldset>
          <PreferredGuide />
          <fieldset className="ys-fieldset">
            <legend>적용받을 은행 금리는요?</legend>
            <div className="ys-rate-row">
              <div className="ys-rate-input">
                <span>연</span>
                <input
                  aria-label="은행 연 금리"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="8"
                  step="0.1"
                  value={rate}
                  aria-invalid={!rateValid}
                  onChange={(e) => setRate(e.target.value)}
                />
                <span>%</span>
              </div>
              <div className="ys-rate-presets">
                {[5, 7, 8].map((n) => (
                  <button
                    key={n}
                    aria-pressed={annualRate === n}
                    onClick={() => setRate(String(n))}
                  >
                    {n}%
                  </button>
                ))}
              </div>
            </div>
            <p className={rateValid ? "ys-fine" : "ys-error"}>
              {rateValid
                ? "기본금리 5%로 시작해요. 우대금리를 충족하면 은행별 최고 7~8%를 적용받을 수 있어요."
                : "0~8% 사이의 금리를 입력해 주세요."}
            </p>
            <p className="ys-fine">
              정부기여금에 붙는 이자는 기본금리 연 5%로 계산해요.
            </p>
          </fieldset>
        </div>
        <aside className="ys-result-column">
          <section
            id="maturity-result"
            className="ys-result-card"
            aria-label="만기 계산 결과"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="ys-result-top">
              <span>36개월 뒤 예상 수령액</span>
              <span className="ys-result-badge">{PLANS[plan].label}</span>
            </div>
            {result ? (
              <>
                <div className="ys-total">
                  <strong>{won(result.total)}</strong>
                  <span>원</span>
                </div>
                <p className="ys-result-description">
                  내가 넣은 돈보다{" "}
                  <strong>{won(result.total - result.principal)}원</strong> 더
                  모여요
                </p>
                <div className="ys-stacked-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${(result.principal / result.total) * 100}%`,
                    }}
                  />
                  <span
                    style={{
                      width: `${(result.contribution / result.total) * 100}%`,
                    }}
                  />
                  <span
                    style={{
                      width: `${((result.interest + result.contributionInterest) / result.total) * 100}%`,
                    }}
                  />
                </div>
                <dl className="ys-breakdown">
                  <div>
                    <dt>
                      <i className="ys-dot-principal" />
                      내가 넣은 원금
                    </dt>
                    <dd>{won(result.principal)}원</dd>
                  </div>
                  <div>
                    <dt>
                      <i className="ys-dot-contribution" />
                      정부기여금 <small>{PLANS[plan].rate * 100}%</small>
                    </dt>
                    <dd>{won(result.contribution)}원</dd>
                  </div>
                  <div>
                    <dt>
                      <i className="ys-dot-interest" />
                      납입금 은행 이자
                    </dt>
                    <dd>{won(result.interest)}원</dd>
                  </div>
                  <div>
                    <dt>
                      <i className="ys-dot-interest" />
                      정부기여금 이자
                    </dt>
                    <dd>{won(result.contributionInterest)}원</dd>
                  </div>
                  <div className="ys-tax-row">
                    <dt>이자소득세</dt>
                    <dd>
                      0원 <span>비과세</span>
                    </dd>
                  </div>
                </dl>
                <p className="ys-result-disclaimer">
                  매월 초 납입·만기 유지·정부기여금 동월 적립을 가정한
                  추정액입니다. 실제 일수·기여금 입금일에 따라 달라집니다.
                </p>
              </>
            ) : (
              <div className="ys-empty-result">
                <strong>입력값을 확인해 주세요</strong>
                <p>납입액과 금리를 입력하면 예상 금액을 보여드려요.</p>
              </div>
            )}
          </section>
          <div className="ys-comparison">
            <h2>같은 납입액으로 비교해요</h2>
            {(Object.keys(PLANS) as Plan[]).map((key) => (
              <div key={key} className={plan === key ? "active" : ""}>
                <span>
                  {PLANS[key].label} <small>{PLANS[key].rate * 100}%</small>
                </span>
                <strong>
                  {valid
                    ? `${won(calculateSavings(amount, annualRate, key).total)}원`
                    : "—"}
                </strong>
              </div>
            ))}
            <p className="ys-fine">
              가입유형은 선택만으로 적용되지 않으며, 각각의 요건을 충족해야
              해요.
            </p>
          </div>
        </aside>
      </div>
      <a className="ys-mobile-result" href="#maturity-result">
        <span>
          <small>36개월 뒤 예상 수령액</small>
          <strong>
            {result ? `${won(result.total)}원` : "입력값을 확인해 주세요"}
          </strong>
        </span>
        <span>결과 보기 ↓</span>
      </a>
      <details className="ys-calculation-notes">
        <summary>계산 방법과 적용 기준 살펴보기</summary>
        <div>
          <p>
            본인 납입금 이자 = 월 납입액 × 연 금리 ÷ 12 × (36 + 35 + … + 1).
            정부기여금 = 총 납입원금 × 6% 또는 12%. 정부기여금 이자는 같은 월
            적립 가정으로 기본금리 5%를 적용합니다. 항목별 원 단위 반올림을
            사용합니다.
          </p>
          <p>
            실제 은행은 각 납입일부터 만기 전날까지의 일수로 계산하며,
            정부기여금은 서민금융진흥원이 은행에 입금한 날부터 이자가 붙습니다.
            따라서 이 계산은 확정 지급액이 아닙니다. 재가입에 따른 기여금
            조정·중도해지·미납·2027년 개편안은 반영하지 않습니다.
          </p>
          <p>
            비과세형은 정부기여금 없이 이자소득 비과세만 적용되는 경우입니다.
            중소기업 우대형의 근속 요건을 충족하지 못한다면 일반형으로 비교해
            주세요.
          </p>
          <a href={POLICY.sources.bank} target="_blank" rel="noreferrer">
            은행 상품 설명과 이자 지급 기준 ↗
          </a>
        </div>
      </details>
    </>
  );
}
