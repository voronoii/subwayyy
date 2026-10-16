import { NUTRITION_SOURCES } from "../lib/nutritionSources";

interface Props {
  brandId: string;
}

export default function NutritionSources({ brandId }: Props) {
  const source = NUTRITION_SOURCES[brandId];
  if (!source) return null;

  return (
    <section className="nutrition-reference nutrition-sources" aria-labelledby="nutrition-sources-heading">
      <h2 id="nutrition-sources-heading">영양정보 출처와 계산 기준</h2>
      <p className="nutrition-reference-description">
        최신 공식 자료:{" "}
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {source.label} ↗
        </a>
      </p>
      <p className="nutrition-reference-description">
        자료 반영일: <time dateTime={source.dataUpdatedAt}>{source.dataUpdatedAt}</time>
        {" "}(메뉴 데이터 변경 기록 기준이며, 영양성분 검증일은 아닙니다.)
      </p>
      <p className="nutrition-reference-description">
        {source.nutritionCheckedAt ? (
          <>영양자료 확인일: <time dateTime={source.nutritionCheckedAt}>{source.nutritionCheckedAt}</time></>
        ) : (
          "영양자료의 별도 확인일은 기록되어 있지 않습니다. 최신 값은 공식 자료를 확인해 주세요."
        )}
      </p>
      <ul>
        {source.notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
    </section>
  );
}
