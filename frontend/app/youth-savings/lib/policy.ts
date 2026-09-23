// 2026-09-23 확인. 정책 근거와 계산 가정은 docs/youth-savings.md 참고.
export const POLICY = {
  checkedAt: "2026-09-23",
  applicationStart: "2026-10-07",
  applicationEnd: "2026-10-16",
  openingStart: "2026-11-16",
  openingEnd: "2026-11-27",
  months: 36,
  maxMonthly: 500_000,
  baseRate: 5,
  sources: {
    announcement: "https://www.fsc.go.kr/no010101/87726",
    product: "https://www.kinfa.or.kr/financialProduct/youthFutureSavings.do",
    detail: "https://fill4young.kinfa.or.kr/yfs/main",
    faq: "https://www.kinfa.or.kr/counselingSupport/oftendoneQuestion.do",
    bank: "https://ombr.kbstar.com/quics?TmpltID=TP03037&page=C106592",
  },
} as const;

export const PLANS = {
  standard: { label: "일반형", rate: 0.06, caption: "정부기여금 6%" },
  preferential: { label: "우대형", rate: 0.12, caption: "정부기여금 12%" },
  taxOnly: { label: "비과세형", rate: 0, caption: "정부기여금 없음" },
} as const;
export type Plan = keyof typeof PLANS;
export const won = (value: number) => Math.round(value).toLocaleString("ko-KR");

// 서민금융진흥원 2025년 기준중위소득 연액의 200% 값. 원 단위 비교.
export const HOUSEHOLD_200 = [
  57_408_312, 94_383_792, 120_608_472, 146_346_552, 170_596_608, 193_555_320,
  215_722_272, 237_889_224,
];
export function householdLimit(members: number, percent: number) {
  const base = HOUSEHOLD_200[members - 1];
  return base === undefined ? null : (base * percent) / 200;
}

export function calculateSavings(
  monthly: number,
  annualRate: number,
  plan: Plan,
) {
  if (
    !Number.isFinite(monthly) ||
    monthly < 1_000 ||
    monthly > POLICY.maxMonthly ||
    monthly % 1_000 !== 0
  ) {
    throw new RangeError(
      "월 납입액은 1천~50만원 사이, 1천원 단위로 입력하세요.",
    );
  }
  if (
    !Number.isFinite(annualRate) ||
    annualRate < 0 ||
    annualRate > 8 ||
    !Object.hasOwn(PLANS, plan)
  ) {
    throw new RangeError("금리와 가입유형을 확인하세요.");
  }
  const principal = monthly * POLICY.months;
  const contribution = Math.round(principal * PLANS[plan].rate);
  // 매월 초 동일 금액 납입, 36+35+...+1개월의 월 단위 단리 추정.
  const monthSum = (POLICY.months * (POLICY.months + 1)) / 2;
  const interest = Math.round((monthly * (annualRate / 100) * monthSum) / 12);
  // 실제 정부기여금 입금일은 다를 수 있음. 동월 적립 가정임을 화면에 명시.
  const contributionInterest = Math.round(
    (monthly * PLANS[plan].rate * (POLICY.baseRate / 100) * monthSum) / 12,
  );
  return {
    principal,
    contribution,
    interest,
    contributionInterest,
    total: principal + contribution + interest + contributionInterest,
  };
}

export type Answers = {
  birthDate: string;
  militaryMonths: string;
  resident: string;
  nationality: string;
  financialTax: string;
  account: string;
  incomeKind: string;
  income: string;
  sales: string;
  sme: string;
  newcomer: string;
  householdSize: string;
  householdIncome: string;
  householdKnown: string;
  dualIncome: string;
};
export const EMPTY_ANSWERS: Answers = {
  birthDate: "",
  militaryMonths: "0",
  resident: "",
  nationality: "",
  financialTax: "",
  account: "",
  incomeKind: "",
  income: "",
  sales: "",
  sme: "",
  newcomer: "",
  householdSize: "1",
  householdIncome: "",
  householdKnown: "",
  dualIncome: "",
};
export type EligibilityResult = {
  status: "eligible" | "ineligible" | "review";
  title: string;
  reasons: string[];
  notes: string[];
  plan?: Plan;
};

export function evaluateEligibility(a: Answers): EligibilityResult {
  const fails: string[] = [];
  const reviews: string[] = [];
  const notes: string[] = [];
  const dob = new Date(`${a.birthDate}T00:00:00Z`);
  const militaryMonths = Number(a.militaryMonths);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(a.birthDate) ||
    !Number.isFinite(dob.getTime()) ||
    dob.toISOString().slice(0, 10) !== a.birthDate ||
    !Number.isInteger(militaryMonths) ||
    militaryMonths < 0 ||
    militaryMonths > 72
  ) {
    reviews.push("생년월일과 병역 이행 기간을 다시 확인해 주세요.");
  } else if (a.birthDate > "2007-11-27") {
    fails.push("이번 계좌 개설 기간 안에 만 19세가 되지 않습니다.");
  } else if (a.birthDate < "1991-11-17") {
    const adjusted = new Date(dob);
    adjusted.setUTCMonth(adjusted.getUTCMonth() + militaryMonths);
    if (
      militaryMonths > 0 &&
      adjusted.toISOString().slice(0, 10) >= "1991-11-01"
    ) {
      reviews.push(
        "병역 기간을 빼면 연령 요건을 충족할 수 있습니다. 정확한 복무일수와 계좌 개설일로 공식 심사를 받아 주세요.",
      );
    } else
      fails.push(
        "만 19~34세 연령 요건을 벗어납니다. 병역 기간은 최대 6년까지 제외합니다.",
      );
  } else if (a.birthDate <= "1991-11-27") {
    notes.push(
      "계좌 개설일에 만 35세가 되기 전이어야 합니다. 11월 16일부터 생일 전날까지의 개설 가능일을 확인하세요.",
    );
  } else if (a.birthDate > "2007-11-16") {
    notes.push("11월 중 만 19세가 되는 생일부터 계좌를 개설할 수 있습니다.");
  }
  if (a.resident === "no") fails.push("국내 거주자 요건을 충족해야 합니다.");
  else if (a.resident !== "yes")
    reviews.push("국내 거주자 해당 여부를 확인해 주세요.");
  if (!a.nationality) reviews.push("국적 구분을 선택해 주세요.");
  if (a.financialTax === "yes")
    fails.push(
      "직전 3개 과세기간 중 금융소득 종합과세 대상 이력이 있으면 가입이 제한됩니다.",
    );
  else if (a.financialTax !== "no")
    reviews.push(
      "직전 3개 과세기간의 금융소득 종합과세 이력을 확인해야 합니다.",
    );
  if (a.account === "future")
    fails.push("청년미래적금은 중복 가입할 수 없습니다.");
  if (a.account === "matured")
    fails.push("청년도약계좌 만기 수령자는 청년미래적금에 가입할 수 없습니다.");
  if (a.account === "rejoin")
    reviews.push(
      "해지 이력에 따라 재가입 시점과 기여금이 달라집니다. 공식 재가입 심사가 필요합니다.",
    );
  if (!a.account) reviews.push("기존 정책계좌 가입 상태를 확인해 주세요.");
  if (a.account === "leap")
    notes.push(
      "2차 모집에서 갈아타기를 신청할 수 있습니다. 미래적금 가입 가능 안내와 개설 후, 안내받은 절차대로 도약계좌 특별중도해지를 신청하세요.",
    );

  const kind = a.incomeKind;
  const income = Number(a.income) * 10_000;
  const sales = Number(a.sales) * 10_000;
  const validIncome =
    a.income.trim() !== "" && Number.isFinite(income) && income > 0;
  const validSales =
    a.sales.trim() !== "" && Number.isFinite(sales) && sales >= 0;
  const businessQualified =
    kind === "business" && validSales && sales <= 300_000_000;
  let standardIncome = false;
  let lowIncome = false;
  if (kind === "none")
    fails.push(
      "2025년 확인 가능한 소득이 없으면 이번 모집에 가입할 수 없습니다. 육아휴직급여·군장병급여는 예외가 있습니다.",
    );
  else if (
    kind === "special" ||
    kind === "mixed" ||
    kind === "unknown" ||
    !kind
  )
    reviews.push(
      "비과세 급여·복수 소득 등은 소득확인증명서와 공식 심사로 가입유형을 확인해 주세요.",
    );
  else {
    const salary = kind === "salary";
    if (!validIncome && !businessQualified)
      reviews.push("2025년 소득금액을 확인해 주세요.");
    if (kind === "business" && !validSales)
      reviews.push(
        "운영 중인 소상공인 사업장의 2025년 합산 연매출을 확인해 주세요.",
      );
    if (
      validIncome &&
      income > (salary ? 75_000_000 : 63_000_000) &&
      !businessQualified
    )
      fails.push("개인소득 또는 소상공인 매출 기준을 초과합니다.");
    standardIncome =
      businessQualified ||
      (validIncome && income <= (salary ? 60_000_000 : 48_000_000));
    lowIncome = validIncome && income <= (salary ? 36_000_000 : 26_000_000);
  }

  const size = Number(a.householdSize);
  const dual = size === 2 && a.dualIncome === "yes";
  const householdIncome = Number(a.householdIncome) * 10_000;
  const householdValid =
    a.householdKnown === "yes" &&
    a.householdIncome.trim() !== "" &&
    Number.isFinite(householdIncome) &&
    householdIncome >= 0;
  const standardLimit = householdLimit(size, dual ? 250 : 200);
  const preferredLimit = householdLimit(size, dual ? 200 : 150);
  if (householdValid && validIncome && householdIncome < income)
    reviews.push(
      "가구소득이 본인 소득보다 작게 입력되어 있습니다. 본인 소득을 포함한 가구원 전체 합계를 확인해 주세요.",
    );
  if (!householdValid || standardLimit === null)
    reviews.push(
      "가구원과 2025년 가구소득을 확인해야 합니다. 9인 이상 가구나 가구원 제외 특례는 공식 심사를 이용하세요.",
    );
  else if (householdIncome > standardLimit)
    fails.push(
      `가구소득이 해당 가구의 연 ${won(standardLimit)}원 기준을 초과합니다.`,
    );
  if (size === 2 && !["yes", "no"].includes(a.dualIncome))
    reviews.push(
      "본인과 배우자만으로 구성된 맞벌이 2인 가구인지 확인해 주세요.",
    );
  if (
    ["salary", "comprehensive"].includes(kind) &&
    !["yes", "no"].includes(a.sme)
  )
    reviews.push(
      "현재 중소기업 재직 여부를 확인하면 우대형을 판단할 수 있습니다.",
    );
  if (a.sme === "yes" && !["yes", "no"].includes(a.newcomer))
    reviews.push("2025년 중소기업 신규 취업 요건을 확인해 주세요.");

  let plan: Plan = standardIncome ? "standard" : "taxOnly";
  const lowHousehold =
    householdValid &&
    preferredLimit !== null &&
    householdIncome <= preferredLimit;
  const smePreferred =
    ["salary", "comprehensive"].includes(kind) &&
    a.sme === "yes" &&
    standardIncome &&
    (a.newcomer === "yes" || (lowIncome && lowHousehold));
  if (
    smePreferred ||
    (businessQualified && sales <= 100_000_000 && lowHousehold)
  )
    plan = "preferential";
  if (smePreferred)
    notes.push(
      "중소기업 우대형은 만기 한 달 전까지 중소기업 재직 합계 29개월 이상, 이직 2회 이하를 충족해야 합니다. 미충족 시 일반형이 적용됩니다.",
    );
  if (a.nationality === "foreign") {
    plan = "taxOnly";
    notes.push(
      "외국인은 정부기여금 없이 비과세 혜택만 받을 수 있으며, 은행 대면 창구에서 신청해야 합니다.",
    );
  }
  if (kind === "business")
    notes.push(
      "소상공인 해당 여부·업종·매출과 현재 사업 운영 사실을 심사합니다. 확인서 발급 요건도 확인하세요.",
    );
  if (fails.length)
    return {
      status: "ineligible",
      title: "입력한 조건으로는 가입이 어려워요",
      reasons: fails,
      notes,
    };
  if (reviews.length)
    return {
      status: "review",
      title: "조금 더 확인이 필요해요",
      reasons: reviews,
      notes,
    };
  return {
    status: "eligible",
    title: `${PLANS[plan].label} 대상에 해당할 가능성이 있어요`,
    reasons: [
      "입력한 연령·개인소득·가구소득이 이번 모집의 기본 요건에 맞습니다.",
    ],
    notes,
    plan,
  };
}
