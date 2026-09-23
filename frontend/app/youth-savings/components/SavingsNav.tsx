"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SavingsNav() {
  const path = usePathname();
  return (
    <nav className="ys-nav" aria-label="청년미래적금 메뉴">
      {[
        ["/youth-savings", "신청 안내"],
        ["/youth-savings/eligibility", "대상자 확인"],
        ["/youth-savings/calculator", "만기 계산기"],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
