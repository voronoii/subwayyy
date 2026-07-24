import Link from "next/link";
import FeedbackButton from "./FeedbackButton";
import VisitorBadge from "./VisitorBadge";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-desc">
        subwayyy.kr은 서브웨이·샐러디·포케올데이 메뉴의 영양성분을 조합별로
        계산하고, 윤달베이커리 삼각이(통밀스콘)의 칼로리·영양성분을 사진
        도감으로 제공하는 무료 도구입니다. 영양 정보는 각 브랜드 공식 자료를
        바탕으로 하며, 실제 제품과 차이가 있을 수 있습니다.
      </p>
      <nav className="site-footer-links">
        <Link href="/calculator/subway">서브웨이</Link>
        <Link href="/calculator/salady">샐러디</Link>
        <Link href="/calculator/poke">포케올데이</Link>
        <Link href="/calculator/yundar">윤달베이커리</Link>
        <Link href="/grass">고양이 놀이방</Link>
        <Link href="/privacy">개인정보처리방침</Link>
        <FeedbackButton />
      </nav>
      <VisitorBadge />
      <p className="site-footer-copy">© {new Date().getFullYear()} subwayyy.kr</p>
    </footer>
  );
}
