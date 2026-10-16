export interface NutritionSource {
  label: string;
  url: string;
  notes: string[];
  /** The last commit date of the stored menu data, not a nutrition review date. */
  dataUpdatedAt: string;
  /** Set only after the stored nutrition values have actually been reviewed. */
  nutritionCheckedAt: string | null;
}

/**
 * These links let visitors check the brand's current guidance. Linking to a
 * current source does not mean that every stored value was checked against it.
 */
export const NUTRITION_SOURCES: Record<string, NutritionSource> = {
  subway: {
    label: "써브웨이 공식 홈페이지",
    url: "https://www.subway.co.kr/",
    dataUpdatedAt: "2026-10-13",
    nutritionCheckedAt: null,
    notes: [
      "이 계산기의 15cm 샌드위치 값은 빵을 제외한 값입니다. 빵·치즈·소스·추가 토핑은 선택한 항목만 합산합니다.",
      "써브웨이 공식 15cm 샌드위치 영양정보는 기본 채소와 위트 빵을 포함한 기준이므로, 이 계산기에서 샌드위치만 선택한 값과 차이가 있습니다.",
      "랩·썹픽·타코 샐러드 등 고정 레시피 메뉴에는 일부 치즈·소스가 포함될 수 있습니다. 같은 재료를 추가로 선택하면 중복 합산될 수 있으니 공식 구성을 확인하세요.",
    ],
  },
  salady: {
    label: "샐러디 영양성분표 (2026년 10월 PDF)",
    url: "/nutrition/salady-2026-10.pdf",
    dataUpdatedAt: "2026-10-16",
    nutritionCheckedAt: "2026-10-16",
    notes: [
      "2026년 10월 영양성분표에 기재된 104개 메뉴·재료의 제공량과 영양성분을 반영했습니다. 선택한 항목의 수치를 합산합니다.",
      "베이스를 변경할 때는 기존 베이스의 영양성분을 빼고 새 베이스의 영양성분을 더해야 합니다. 이 계산기는 기존 베이스를 자동으로 차감하지 않습니다.",
      "PDF에는 메뉴별 드레싱 포함 여부가 명시되어 있지 않습니다. 추가로 선택한 드레싱·토핑·베이스는 모두 합산되므로 실제 주문 구성과 비교해 주세요.",
      "세트 메뉴는 카사바칩 또는 오렌지 크림치즈 브레드와 선택한 음료의 영양성분을 함께 합산하세요.",
      "아메리카노의 영양성분은 HOT 음료 기준입니다.",
      "표시된 수치는 제품 표준 제공량 기준이며, 실제 제공량과 원부재료 수급에 따라 차이가 있을 수 있습니다.",
    ],
  },
  poke: {
    label: "포케올데이 공식 칼로리·영양성분",
    url: "https://pokeallday.co.kr/nutrition",
    dataUpdatedAt: "2026-02-21",
    nutritionCheckedAt: null,
    notes: [
      "등록된 메뉴·베이스·토핑·소스 중 선택한 항목의 영양성분을 합산합니다.",
      "메뉴별 제공량과 베이스·소스 포함 여부는 공식 안내를 확인하세요. 완성 메뉴에 포함된 재료를 다시 선택하면 중복 합산될 수 있습니다.",
    ],
  },
  yundar: {
    label: "윤달베이커리 공식 스마트스토어",
    url: "https://smartstore.naver.com/yunder",
    dataUpdatedAt: "2026-10-11",
    nutritionCheckedAt: null,
    notes: [
      "제품별로 등록된 1개 기준 영양성분을 표시합니다. 중량이 안내된 제품은 해당 중량을 함께 확인하세요.",
      "순탄수는 총 탄수화물과 다른 항목입니다. 추정값이나 영양정보가 없는 제품은 개별 안내를 확인하세요.",
      "주간 판매목록의 확인일은 영양성분 검증일과 다릅니다. 실제 판매 여부와 최신 원재료·알레르기 정보는 공식 판매 페이지를 확인하세요.",
    ],
  },
};
