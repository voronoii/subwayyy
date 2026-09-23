import type { Metadata } from "next";
import Link from "next/link";
import SavingsNav from "./components/SavingsNav";
import { POLICY } from "./lib/policy";
import "./savings.css";

export const metadata: Metadata = {
  title: "청년미래적금 2차 신청 안내·대상자 확인·만기 계산기",
  description:
    "2026 청년미래적금 2차 신청은 10월 7~16일. 가입 조건을 확인하고 일반형 6%·우대형 12% 정부기여금과 만기 예상 수령액을 계산하세요.",
  keywords: [
    "청년미래적금",
    "청년미래적금 2차",
    "청년미래적금 계산기",
    "청년미래적금 우대형",
    "청년미래적금 가입조건",
  ],
  openGraph: {
    title: "청년미래적금, 이번엔 놓치지 않게",
    description: "2차 신청 일정부터 대상자 확인, 3년 뒤 예상 수령액까지.",
    siteName: "subwayyy.kr",
    type: "website",
    locale: "ko_KR",
    url: "/youth-savings",
    images: [{ url: "/youth-savings/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "청년미래적금 2차 안내와 계산기",
    images: ["/youth-savings/og.png"],
  },
};

export default function SavingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="youth-site">
      <a className="ys-skip" href="#savings-main">
        본문 바로가기
      </a>
      <header className="ys-header">
        <div className="ys-header-inner">
          <Link className="ys-brand" href="/youth-savings">
            <span className="ys-brand-symbol" aria-hidden="true">
              ↗
            </span>
            <span>
              청년미래적금<span className="ys-brand-by">by subwayyy.kr</span>
            </span>
          </Link>
          <SavingsNav />
        </div>
      </header>
      <main id="savings-main" className="ys-main">
        {children}
      </main>
      <footer className="ys-footer">
        <div className="ys-footer-top">
          <Link href="/youth-savings" className="ys-footer-brand">
            청년미래적금 안내
          </Link>
          <span>공식 자료 확인일 {POLICY.checkedAt.replaceAll("-", ".")}</span>
        </div>
        <p>
          subwayyy.kr이 제공하는 비공식 안내 도구입니다. 대상자 확인은
          자가진단이며, 최종 가입 여부와 지급액은 취급기관의 심사·약관에
          따릅니다.
        </p>
        <div className="ys-source-links">
          <a
            href={POLICY.sources.announcement}
            target="_blank"
            rel="noreferrer"
          >
            금융위원회 2차 모집 공고 ↗
          </a>
          <a href={POLICY.sources.product} target="_blank" rel="noreferrer">
            서민금융진흥원 상품 안내 ↗
          </a>
          
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </footer>
    </div>
  );
}
