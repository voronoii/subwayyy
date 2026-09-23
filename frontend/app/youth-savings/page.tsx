import type { Metadata } from "next";
import Link from "next/link";
import ApplicationStatus from "./components/ApplicationStatus";
import { POLICY } from "./lib/policy";

export const metadata: Metadata = {
  alternates: { canonical: "/youth-savings" },
};
const faqs = [
  [
    "청년도약계좌가 있어도 신청할 수 있나요?",
    "이번 2차 모집에서도 갈아타기가 가능합니다. 청년미래적금 가입 신청과 심사를 거쳐 계좌를 개설한 뒤, 개별 안내에 따라 청년도약계좌 특별중도해지를 신청하세요. 두 상품의 중복 유지는 불가하며, 청년도약계좌 만기 수령자는 가입할 수 없습니다.",
  ],
  [
    "매달 50만원씩 꼭 넣어야 하나요?",
    "아니요. 월 1천원부터 50만원까지 1천원 단위로 자유롭게 납입할 수 있습니다. 납입을 쉬는 달이 있어도 계좌는 유지되지만, 정부기여금과 이자는 실제 납입액에 따라 달라집니다.",
  ],
  [
    "정부기여금 12%가 적금 금리인가요?",
    "아니요. 우대형의 정부기여금은 납입액의 12%를 지원하는 금액입니다. 은행 이자는 별도로 붙습니다. 일반형은 6%이며, 소득에 따라 정부기여금 없이 비과세만 적용될 수도 있습니다.",
  ],
  [
    "우대형 기여금이 더 늘어난다는 소식은요?",
    "2027년 예산안에 우대형 기여금 확대가 포함되어 있지만, 2026년 9월 23일 확인 기준 확정 전입니다. 이 페이지의 자가진단과 계산기는 현행 6%·12% 기준만 적용합니다.",
  ],
  [
    "중도에 해지하면 어떻게 되나요?",
    "일반 중도해지는 정부기여금과 비과세 혜택을 받을 수 없습니다. 퇴직·폐업 등 특별중도해지 사유에 해당하면 별도 요건이 적용되므로 취급기관에 확인하세요.",
  ],
];

export default function SavingsHome() {
  return (
    <>
      <section className="ys-hero">
        <div className="ys-hero-copy">
          <ApplicationStatus />
          <h1>
            청년미래적금,
            <br />
            이번엔 놓치지 않게.
          </h1>
          <p>
            매달 모으는 돈에 정부의 지원을 더해요.
            <br />
            가입 조건부터 3년 뒤 받을 금액까지 확인해 보세요.
          </p>
          <div className="ys-actions">
            <Link href="/youth-savings/eligibility" className="ys-button">
              나는 대상자일까? <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/youth-savings/calculator"
              className="ys-button ys-button-secondary"
            >
              만기 금액 계산하기
            </Link>
          </div>
          <span className="ys-hero-note">
            회원가입 없이, 간편하게 확인하세요
          </span>
        </div>
        <div className="ys-calendar">
          <div className="ys-calendar-top">
            <span>2026년 2차 신청 일정</span>
            <span className="ys-calendar-icon" aria-hidden="true">
              ▦
            </span>
          </div>
          <div className="ys-calendar-month">10월</div>
          <div className="ys-calendar-date">
            7<span>일</span>
            <i>—</i>16<span>일</span>
          </div>
          <p>취급 금융기관 앱에서 신청</p>
          <div className="ys-calendar-days">
            <div>
              <strong>
                7<span>수</span>
              </strong>
              <span>홀수 연도생</span>
            </div>
            <div>
              <strong>
                8<span>목</span>
              </strong>
              <span>짝수 연도생</span>
            </div>
            <div>
              <strong>12–16</strong>
              <span>누구나 신청</span>
            </div>
          </div>
          <div className="ys-calendar-foot">
            10월 9~11일은 신청을 받지 않아요
          </div>
        </div>
      </section>
      <section className="ys-facts" aria-label="상품 핵심 요약">
        <div>
          <span>저축 기간</span>
          <strong>
            3년 <small>36개월</small>
          </strong>
        </div>
        <div>
          <span>월 납입 한도</span>
          <strong>50만원</strong>
        </div>
        <div>
          <span>정부기여금</span>
          <strong>
            6% <small>또는</small> 12%
          </strong>
        </div>
        <div>
          <span>이자소득세</span>
          <strong>비과세</strong>
        </div>
      </section>
      <section className="ys-section ys-how">
        <div className="ys-section-heading">
          <h2>내 저축에 더해지는 혜택</h2>
          <p>은행 이자와 정부기여금은 별개예요.</p>
        </div>
        <div className="ys-benefit-grid">
          <article>
            <span className="ys-benefit-icon" aria-hidden="true">
              ＋
            </span>
            <h3>
              내가 넣은 만큼,
              <br />
              정부도 함께 적립
            </h3>
            <p>
              일반형은 납입액의 6%, 우대형은 12%를 지원해요. 월 50만원을 넣으면
              매달 3만원 또는 6만원이 더해져요.
            </p>
          </article>
          <article>
            <span className="ys-benefit-icon ys-mint" aria-hidden="true">
              %
            </span>
            <h3>
              은행 이자는 별도로,
              <br />
              이자소득세는 없이
            </h3>
            <p>
              기본금리 연 5%, 우대조건 충족 시 취급기관별 최고 연 7~8%예요.
              나에게 적용되는 금리를 확인하세요.
            </p>
          </article>
          <article className="ys-benefit-highlight">
            <span className="ys-small-tag">중소기업 근로자 · 소상공인</span>
            <h3>
              나는 우대형에
              <br />
              해당할까?
            </h3>
            <p>
              소득과 가구 조건, 취업 시점에 따라 달라져요. 질문에 답하고 예상
              가입유형을 확인해 보세요.
            </p>
            <Link href="/youth-savings/eligibility">
              대상자 확인하기 <span aria-hidden="true">↗</span>
            </Link>
          </article>
        </div>
      </section>
      <section className="ys-section">
        <div className="ys-section-heading">
          <h2>신청부터 계좌 개설까지</h2>
          <p>신청 후 심사를 통과해야 적금을 시작할 수 있어요.</p>
        </div>
        <ol className="ys-timeline">
          <li>
            <span>1</span>
            <div>
              <p>10.7 — 10.16</p>
              <h3>가입 신청</h3>
              <small>
                취급 금융기관 앱에서 신청
                <br />첫 이틀은 출생연도 홀짝제
              </small>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <p>10.19 — 11.13</p>
              <h3>가입 요건 심사</h3>
              <small>
                2025년 소득·가구·우대형 요건 확인
                <br />
                가구원 정보제공 동의 등 안내 확인
              </small>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <p>11.16 — 11.27</p>
              <h3>계좌 개설 및 납입</h3>
              <small>
                심사 통과자 대상 개별 안내
                <br />
                개설일 기준 연령 요건 확인
              </small>
            </div>
          </li>
        </ol>
        <p className="ys-fine">
          심사 일정은 신청 인원과 진행 상황에 따라 변경될 수 있습니다.
        </p>
      </section>
      <section className="ys-section ys-faq">
        <div className="ys-section-heading">
          <h2>신청 전에 궁금한 것들</h2>
          <a
            href={POLICY.sources.announcement}
            target="_blank"
            rel="noreferrer"
          >
            공식 공고 보기 ↗
          </a>
        </div>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">＋</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <section className="ys-bottom-cta">
        <div>
          <h2>3년 뒤, 얼마를 모을 수 있을까요?</h2>
          <p>내가 부담 없이 넣을 수 있는 금액부터 계산해 보세요.</p>
        </div>
        <Link href="/youth-savings/calculator" className="ys-button">
          만기 계산기 열기 <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
