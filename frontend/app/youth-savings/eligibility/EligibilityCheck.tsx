"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  EMPTY_ANSWERS,
  evaluateEligibility,
  householdLimit,
  PLANS,
  POLICY,
  won,
  type Answers,
} from "../lib/policy";

function Choice({
  title,
  name,
  value,
  onChange,
  options,
  help,
}: {
  title: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  help?: string;
}) {
  return (
    <fieldset className="ys-question">
      <legend>{title}</legend>
      {help && <p className="ys-help">{help}</p>}
      <div className="ys-choice-options">
        {options.map(([id, label]) => (
          <label className={id === value ? "selected" : ""} key={id}>
            <input
              type="radio"
              name={name}
              value={id}
              checked={id === value}
              onChange={() => onChange(id)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
const yesNo: [string, string][] = [
  ["yes", "예"],
  ["no", "아니요"],
];
const yesNoUnknown: [string, string][] = [
  ...yesNo,
  ["unknown", "잘 모르겠어요"],
];
const STEPS = ["기본 정보", "개인소득", "가구소득", "마지막 확인"];

export default function EligibilityCheck() {
  const [answers, setAnswers] = useState<Answers>({ ...EMPTY_ANSWERS });
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current) heading.current?.focus();
  }, [step, done]);
  const set = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setError("");
  };
  const isRegularIncome = ["salary", "comprehensive", "business"].includes(
    answers.incomeKind,
  );
  const householdPercent =
    answers.householdSize === "2" && answers.dualIncome === "yes" ? 250 : 200;
  const limit = householdLimit(Number(answers.householdSize), householdPercent);
  const positive = (s: string, zero = false) =>
    s.trim() !== "" &&
    Number.isFinite(Number(s)) &&
    (zero ? Number(s) >= 0 : Number(s) > 0);
  function next() {
    let message = "";
    if (
      step === 0 &&
      (!answers.birthDate ||
        !answers.resident ||
        !answers.nationality ||
        !Number.isInteger(Number(answers.militaryMonths)) ||
        Number(answers.militaryMonths) < 0 ||
        Number(answers.militaryMonths) > 72)
    )
      message =
        "생년월일, 거주자 여부, 국적과 병역 기간(0~72개월)을 확인해 주세요.";
    if (
      step === 1 &&
      (!answers.incomeKind ||
        (isRegularIncome &&
          (!positive(answers.income, answers.incomeKind === "business") ||
            (answers.incomeKind === "business" &&
              !positive(answers.sales, true)) ||
            (answers.incomeKind !== "business" &&
              (!answers.sme || (answers.sme === "yes" && !answers.newcomer))))))
    )
      message = "소득 유형과 해당하는 소득·재직 정보를 모두 입력해 주세요.";
    if (
      step === 2 &&
      (!answers.householdKnown ||
        (answers.householdKnown === "yes" &&
          (!positive(answers.householdIncome, true) ||
            (answers.householdSize === "2" && !answers.dualIncome))))
    )
      message = "가구소득과 해당하는 맞벌이 여부를 확인해 주세요.";
    if (step === 3 && (!answers.financialTax || !answers.account))
      message = "금융소득 종합과세 이력과 기존 계좌 상태를 선택해 주세요.";
    if (message) {
      setError(message);
      return;
    }
    interacted.current = true;
    setError("");
    if (step === 3) setDone(true);
    else setStep((s) => s + 1);
  }
  const result = done ? evaluateEligibility(answers) : null;
  return (
    <div className="ys-check-shell">
      <div className="ys-page-intro">
        <Link href="/youth-savings" className="ys-back">
          ‹ 신청 안내
        </Link>
        <h1>나는 가입할 수 있을까요?</h1>
        <p>네 단계로 확인하는 나의 예상 가입유형</p>
      </div>
      <p className="ys-privacy-note">
        <span aria-hidden="true">⌁</span> 입력값은 이 화면에서만 사용하며
        저장하거나 서버로 전송하지 않아요.
      </p>
      {!done ? (
        <>
          <ol className="ys-progress" aria-label="자가진단 진행 단계">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={i <= step ? "active" : ""}
                aria-current={i === step ? "step" : undefined}
              >
                <span>{i < step ? "✓" : i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <form
            className="ys-check-form"
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <div className="ys-question-heading">
              <span>{step + 1} / 4</span>
              <h2 ref={heading} tabIndex={-1}>
                {
                  [
                    "먼저, 기본 정보를 알려주세요",
                    "2025년 소득을 확인해 볼게요",
                    "함께 사는 가구의 소득은요?",
                    "가입 제한 조건을 확인해요",
                  ][step]
                }
              </h2>
            </div>
            {step === 0 && (
              <>
                <div className="ys-question">
                  <label htmlFor="birth-date">생년월일</label>
                  <p className="ys-help">
                    나이는 2026년 11월 계좌 개설일을 기준으로 확인해요.
                  </p>
                  <input
                    className="ys-text-input"
                    id="birth-date"
                    type="date"
                    required
                    min="1900-01-01"
                    max="2026-11-27"
                    value={answers.birthDate}
                    onChange={(e) => set("birthDate", e.target.value)}
                  />
                </div>
                <div className="ys-question">
                  <label htmlFor="military-months">병역 이행 기간</label>
                  <p className="ys-help">
                    해당하지 않으면 0개월. 연령 계산에서 최대 6년을 제외할 수
                    있어요.
                  </p>
                  <div className="ys-unit-input">
                    <input
                      id="military-months"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="72"
                      step="1"
                      required
                      value={answers.militaryMonths}
                      onChange={(e) => set("militaryMonths", e.target.value)}
                    />
                    <span>개월</span>
                  </div>
                </div>
                <Choice
                  title="국내 거주자에 해당하나요?"
                  name="resident"
                  value={answers.resident}
                  onChange={(v) => set("resident", v)}
                  options={yesNoUnknown}
                  help="국내에 주소가 있거나 183일 이상 거소를 둔 경우예요."
                />
                <Choice
                  title="국적을 선택해 주세요"
                  name="nationality"
                  value={answers.nationality}
                  onChange={(v) => set("nationality", v)}
                  options={[
                    ["korean", "대한민국"],
                    ["foreign", "외국 국적"],
                  ]}
                  help="외국인도 요건 충족 시 가입할 수 있지만 정부기여금은 지급되지 않아요."
                />
              </>
            )}
            {step === 1 && (
              <>
                <Choice
                  title="2025년에 어떤 소득이 있었나요?"
                  name="income-kind"
                  value={answers.incomeKind}
                  onChange={(v) => {
                    setAnswers((a) => ({
                      ...a,
                      incomeKind: v,
                      income: "",
                      sales: "",
                      sme: "",
                      newcomer: "",
                    }));
                    setError("");
                  }}
                  options={[
                    ["salary", "근로소득 (총급여)"],
                    ["comprehensive", "종합소득 (프리랜서·휴폐업 등)"],
                    ["business", "현재 운영 중인 소상공인"],
                    ["mixed", "근로·사업 등 여러 종류의 소득"],
                    ["special", "육아휴직급여·군장병급여만 있었어요"],
                    ["none", "확인 가능한 소득이 없었어요"],
                    ["unknown", "잘 모르겠어요"],
                  ]}
                  help="실수령액이 아닌, 국세청에서 확인되는 2025년 소득 기준이에요. 복수 소득과 비과세 급여는 공식 확인이 필요해요."
                />
                {isRegularIncome && (
                  <>
                    <div className="ys-question">
                      <label htmlFor="personal-income">
                        {answers.incomeKind === "salary"
                          ? "2025년 총급여"
                          : "2025년 종합소득금액"}
                      </label>
                      <div className="ys-unit-input">
                        <input
                          id="personal-income"
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={answers.income}
                          onChange={(e) => set("income", e.target.value)}
                        />
                        <span>만원 / 연</span>
                      </div>
                      <p className="ys-help">
                        예: 3,600만원이면 3600 입력. 소득확인증명서의 금액을
                        확인해 주세요.
                      </p>
                    </div>
                    {answers.incomeKind === "business" ? (
                      <div className="ys-question">
                        <label htmlFor="annual-sales">
                          2025년 모든 사업장 합산 매출
                        </label>
                        <div className="ys-unit-input">
                          <input
                            id="annual-sales"
                            type="number"
                            min="0"
                            step="any"
                            inputMode="decimal"
                            value={answers.sales}
                            onChange={(e) => set("sales", e.target.value)}
                          />
                          <span>만원 / 연</span>
                        </div>
                        <p className="ys-help">
                          1억원이면 10000 입력. 현재 운영 중인 소상공인에
                          한하며, 휴·폐업자는 종합소득으로 확인하세요.
                        </p>
                      </div>
                    ) : (
                      <>
                        <Choice
                          title="현재 중소기업에 재직 중인가요?"
                          name="sme"
                          value={answers.sme}
                          onChange={(v) => {
                            set("sme", v);
                            set("newcomer", "");
                          }}
                          options={yesNoUnknown}
                          help="중소기업기본법상 중소기업인지 확인해 주세요. 재직 중 육아휴직도 포함해요."
                        />
                        {answers.sme === "yes" && (
                          <Choice
                            title="2025년 신규 취업 요건에 해당하나요?"
                            name="newcomer"
                            value={answers.newcomer}
                            onChange={(v) => set("newcomer", v)}
                            options={yesNoUnknown}
                            help="2025년에 최초 취업했거나, 2025년 해당 기업 취업일 전 고용보험 가입 기간이 총 1년 미만인 경우예요. 정확한 인정 이력은 공식 심사에서 확인해요."
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <Choice
                  title="2025년 가구소득을 알고 있나요?"
                  name="household-known"
                  value={answers.householdKnown}
                  onChange={(v) => set("householdKnown", v)}
                  options={[
                    ["yes", "알고 있어요"],
                    ["unknown", "모르겠어요 · 가구원 특례 확인이 필요해요"],
                  ]}
                  help="주민등록표등본과 공식 가구원 인정 기준에 따라 판단해요. 가구원 제외 등 특례가 있다면 공식 심사가 필요해요."
                />
                {answers.householdKnown === "yes" && (
                  <>
                    <div className="ys-question">
                      <label htmlFor="household-size">
                        본인을 포함한 가구원 수
                      </label>
                      <select
                        id="household-size"
                        className="ys-text-input"
                        value={answers.householdSize}
                        onChange={(e) => {
                          set("householdSize", e.target.value);
                          set("dualIncome", "");
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <option value={n} key={n}>
                            {n === 9
                              ? "9인 이상 (공식 확인 필요)"
                              : `${n}인 가구`}
                          </option>
                        ))}
                      </select>
                    </div>
                    {answers.householdSize === "2" && (
                      <Choice
                        title="본인과 배우자만 있는 맞벌이 가구인가요?"
                        name="dual-income"
                        value={answers.dualIncome}
                        onChange={(v) => set("dualIncome", v)}
                        options={yesNoUnknown}
                        help="등본상 본인과 배우자로 구성되고, 두 사람 모두 국세청 소득금액이 확인되어야 해요."
                      />
                    )}
                    <div className="ys-question">
                      <label htmlFor="household-income">
                        2025년 가구원 전체의 연소득 합계
                      </label>
                      <div className="ys-unit-input">
                        <input
                          id="household-income"
                          type="number"
                          min="0"
                          step="any"
                          inputMode="decimal"
                          value={answers.householdIncome}
                          onChange={(e) =>
                            set("householdIncome", e.target.value)
                          }
                        />
                        <span>만원 / 연</span>
                      </div>
                      <p className="ys-help">
                        본인 소득도 포함해 주세요. 5,000만원이면 5000 입력.
                      </p>
                    </div>
                    {limit !== null && (
                      <div className="ys-notice">
                        <strong>
                          {answers.householdSize}인 가구 가입 기준
                        </strong>
                        <br />연 {won(limit)}원 이하{" "}
                        <span>(중위소득 {householdPercent}%)</span>
                        <p>일부 우대형은 더 낮은 가구소득 기준을 적용해요.</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {step === 3 && (
              <>
                <Choice
                  title="2023~2025년 중 금융소득 종합과세 대상이었던 적이 있나요?"
                  name="financial-tax"
                  value={answers.financialTax}
                  onChange={(v) => set("financialTax", v)}
                  options={yesNoUnknown}
                  help="이자·배당 등 금융소득이 종합과세 대상이 된 이력을 확인해 주세요."
                />
                <Choice
                  title="기존 정책계좌 상태는 어떤가요?"
                  name="account"
                  value={answers.account}
                  onChange={(v) => set("account", v)}
                  options={[
                    ["none", "두 상품 모두 가입·해지 이력이 없어요"],
                    ["leap", "청년도약계좌를 유지 중이에요 (갈아타기)"],
                    ["matured", "청년도약계좌 만기금을 받았어요"],
                    ["future", "청년미래적금을 유지 중이에요"],
                    ["rejoin", "중도해지·재가입 등 다른 이력이 있어요"],
                  ]}
                />
                <div className="ys-notice">
                  입력한 정보로 기본 조건을 확인해요. 소득증빙·재직·가구원 인정
                  등은 은행과 서민금융진흥원의 심사에서 최종 결정됩니다.
                </div>
              </>
            )}
            {error && (
              <p className="ys-error" role="alert">
                {error}
              </p>
            )}
            <div className="ys-form-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="ys-button ys-button-secondary"
                  onClick={() => {
                    interacted.current = true;
                    setStep((s) => s - 1);
                    setError("");
                  }}
                >
                  이전
                </button>
              )}
              <button className="ys-button" type="submit">
                {step === 3 ? "나의 예상 결과 보기" : "다음 단계"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </>
      ) : (
        result && (
          <section
            className={`ys-eligibility-result ys-eligibility-${result.status}`}
          >
            <span className="ys-result-symbol" aria-hidden="true">
              {result.status === "eligible"
                ? "✓"
                : result.status === "review"
                  ? "?"
                  : "i"}
            </span>
            <p className="ys-small-tag">자가진단 결과 · 최종 심사 전</p>
            <h2 ref={heading} tabIndex={-1}>
              {result.title}
            </h2>
            {result.plan && (
              <div className="ys-eligibility-plan">
                <span>{PLANS[result.plan].label}</span>
                <strong>정부기여금 {PLANS[result.plan].rate * 100}%</strong>
                <span>이자소득 비과세</span>
              </div>
            )}
            <ul className="ys-result-reasons">
              {result.reasons.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {!!result.notes.length && (
              <div className="ys-result-notes">
                <h3>함께 확인해 주세요</h3>
                <ul>
                  {result.notes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="ys-fine">
              자가진단으로 가입·지원금 지급이 확정되지 않습니다. 답변이
              불확실하거나 특례에 해당하면 서민금융진흥원에서 확인해 주세요.
            </p>
            <div className="ys-result-actions">
              {result.plan ? (
                <Link
                  className="ys-button"
                  href={`/youth-savings/calculator?plan=${result.plan}`}
                >
                  이 유형으로 만기 금액 계산하기
                </Link>
              ) : (
                <a
                  className="ys-button"
                  href={POLICY.sources.detail}
                  target="_blank"
                  rel="noreferrer"
                >
                  공식 가입 안내 확인하기 ↗
                </a>
              )}
              <button
                className="ys-button ys-button-secondary"
                onClick={() => {
                  interacted.current = true;
                  setDone(false);
                  setStep(0);
                }}
              >
                입력한 내용 수정하기
              </button>
              <button
                className="ys-text-button"
                onClick={() => {
                  interacted.current = true;
                  setDone(false);
                  setStep(0);
                  setAnswers({ ...EMPTY_ANSWERS });
                }}
              >
                처음부터 다시 확인
              </button>
            </div>
          </section>
        )
      )}
    </div>
  );
}
