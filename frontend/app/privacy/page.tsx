import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "subwayyy.kr 개인정보처리방침",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <Link href="/calculator/subway" className="policy-back">
        ← 계산기로 돌아가기
      </Link>
      <h1>개인정보처리방침</h1>
      <p>
        subwayyy.kr(이하 &ldquo;사이트&rdquo;)는 별도의 회원가입 없이 이용할 수
        있으며, 이용자의 개인정보를 직접 수집하거나 저장하지 않습니다.
      </p>

      <h2>1. 수집하는 정보</h2>
      <p>
        사이트는 이름, 이메일 등 개인 식별 정보를 수집하지 않습니다. 칼로리
        계산 기록과 고양이 놀이방 데이터는 이용자의 브라우저(localStorage)에만
        저장되며 서버로 전송되지 않습니다. 고양이 사진을 업로드하는 경우에도
        변환은 브라우저 안에서만 처리되고 원본 사진은 서버에 업로드되지
        않습니다.
      </p>

      <h2>2. 쿠키 및 광고</h2>
      <p>
        사이트는 서비스 개선을 위해 Google Analytics를 사용하며, Google
        AdSense를 통해 광고를 게재합니다. Google을 포함한 제3자 광고 사업자는
        쿠키를 사용하여 이용자의 이전 방문 기록에 기반한 광고를 표시할 수
        있습니다. 이용자는{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google 광고 설정
        </a>
        에서 맞춤 광고를 해제할 수 있습니다.
      </p>

      <h2>3. 문의</h2>
      <p>
        개인정보 관련 문의는 사이트 운영자에게 이메일로 연락해 주시기 바랍니다.
      </p>

      <p className="policy-date">시행일: 2026년 7월 3일</p>
    </main>
  );
}
