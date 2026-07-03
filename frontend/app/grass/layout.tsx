import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고양이 놀이방 — 모두의 식단 조합 구경하기",
  description:
    "칼로리 계산 결과로 고양이를 불러보세요. 내 고양이 사진을 픽셀 고양이로 만들어 놀이방에 풀어놓을 수도 있어요.",
  alternates: {
    canonical: "/grass",
  },
};

export default function GrassLayout({ children }: { children: React.ReactNode }) {
  return children;
}
