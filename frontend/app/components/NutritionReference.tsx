import type { BrandConfig, MenuCategory, MenuItem } from "../data/types";
import "./nutrition-reference.css";

interface NutritionReferenceProps {
  config: BrandConfig;
}

/** 주간 목록과 영양표가 제품 순서 변경 후에도 같은 제품을 가리키도록 한다. */
export function nutritionItemId(brandId: string, categoryId: string, name: string): string {
  let hash = 2166136261;
  for (let index = 0; index < name.length; index += 1) {
    hash = Math.imul(hash ^ name.charCodeAt(index), 16777619);
  }
  return `nutrition-${brandId}-${categoryId}-${(hash >>> 0).toString(36)}`;
}

function nutritionValue(item: MenuItem, key: keyof MenuItem): string {
  const value = item[key];
  return !item.noNutrition && typeof value === "number" && Number.isFinite(value)
    ? String(value)
    : "—";
}

interface WeeklyProduct {
  name: string;
  item?: MenuItem;
  category?: MenuCategory;
}

function WeeklyProductList({
  products,
  config,
}: {
  products: WeeklyProduct[];
  config: BrandConfig;
}) {
  return (
    <ul className="nutrition-weekly-list">
      {products.map(({ name, item, category }) => (
        <li key={name} className="nutrition-weekly-product">
          {item?.image && (
            <img
              className="nutrition-weekly-image"
              src={`/${config.id}/${item.image}`}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="nutrition-weekly-product-body">
            <span className="nutrition-weekly-category">{category?.label ?? "제품 정보 준비 중"}</span>
            {item && category ? (
              <a href={`#${nutritionItemId(config.id, category.id, name)}`}>{name}</a>
            ) : (
              <span className="nutrition-weekly-name">{name}</span>
            )}
            <span className="nutrition-weekly-calories">
              {item && !item.noNutrition && Number.isFinite(item.calories)
                ? `${item.calories} kcal`
                : "영양정보 준비 중"}
            </span>
            {item?.nutritionNote && <p className="nutrition-weekly-note">{item.nutritionNote}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function WeeklyChanges({
  config,
  productsByName,
}: {
  config: BrandConfig;
  productsByName: Map<string, WeeklyProduct>;
}) {
  const weekly = config.weekly;
  const previous = weekly?.previous;
  if (!weekly || !previous) return null;

  const currentNames = new Set(weekly.available);
  const previousNames = new Set(previous.available);
  const added = [...currentNames].filter((name) => !previousNames.has(name));
  const removed = [...previousNames].filter((name) => !currentNames.has(name));
  const groups = [
    { label: "판매목록에 추가", names: added },
    { label: "판매목록에서 제외", names: removed },
  ];

  return (
    <details className="nutrition-weekly-changes">
      <summary>{previous.weekLabel} 대비 <span>+{added.length}종 / −{removed.length}종</span></summary>
      <p className="nutrition-reference-description">
        {previous.weekLabel} 판매목록(<time dateTime={previous.updatedAt}>{previous.updatedAt}</time> 기준)과 비교했습니다.
      </p>
      {added.length === 0 && removed.length === 0 ? (
        <p className="nutrition-reference-description">비교한 회차와 판매목록이 같습니다.</p>
      ) : groups.map(({ label, names }) => (
        <div className="nutrition-weekly-change-group" key={label}>
          <h3>{label} · {names.length}종</h3>
          {names.length === 0 ? (
            <p className="nutrition-reference-description">해당 제품이 없습니다.</p>
          ) : (
            <ul>
              {names.map((name) => {
                const product = productsByName.get(name);
                return (
                  <li key={name}>
                    {product?.item && product.category ? (
                      <a href={`#${nutritionItemId(config.id, product.category.id, name)}`}>{name}</a>
                    ) : name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </details>
  );
}

export function WeeklySelection({ config }: NutritionReferenceProps) {
  const weekly = config.weekly;
  if (!weekly || weekly.available.length === 0) return null;

  const productsByName = new Map<string, WeeklyProduct>();
  for (const category of config.categories) {
    for (const item of category.items) {
      productsByName.set(item.name, { name: item.name, item, category });
    }
  }
  // 데이터에 아직 영양정보가 없는 판매 제품도 목록에서는 누락하지 않는다.
  const products = weekly.available.map((name) => productsByName.get(name) ?? { name });
  const preview = products.slice(0, 6);
  const rest = products.slice(6);

  return (
    <section className="nutrition-reference nutrition-weekly" aria-labelledby={`${config.id}-weekly-heading`}>
      <p className="nutrition-reference-eyebrow">매주 업데이트하는 판매 메뉴</p>
      <h2 id={`${config.id}-weekly-heading`}>{config.name} 이번 회차 판매목록</h2>
      <p className="nutrition-weekly-summary">
        <strong>{weekly.weekLabel} · {products.length}종</strong>
        <span><time dateTime={weekly.updatedAt}>{weekly.updatedAt}</time> 확인 기준</span>
      </p>
      <WeeklyChanges config={config} productsByName={productsByName} />
      <p className="nutrition-reference-description">
        이번 회차의 제품명과 칼로리를 확인하세요. 제품명을 누르면 전체 영양성분 표로 이동합니다.
      </p>
      <WeeklyProductList products={preview} config={config} />
      {rest.length > 0 && (
        <details className="nutrition-weekly-more">
          <summary>이번 회차 판매목록 전체 보기 <span>+{rest.length}종</span></summary>
          <WeeklyProductList products={rest} config={config} />
        </details>
      )}
      <p className="nutrition-reference-description nutrition-weekly-source">
        판매목록은 위 기준일의 정보이며 품절·판매 일정은 달라질 수 있습니다.
        {config.sourceUrl && (
          <> <a href={config.sourceUrl} target="_blank" rel="noopener noreferrer">공식 판매처에서 구매·판매 여부 확인</a></>
        )}
      </p>
    </section>
  );
}

export default function NutritionReference({ config }: NutritionReferenceProps) {
  const count = config.categories.reduce((total, category) => total + category.items.length, 0);
  const isCatalog = config.layout === "catalog";

  return (
    <section className="nutrition-reference" aria-labelledby={`${config.id}-nutrition-heading`}>
      <h2 id={`${config.id}-nutrition-heading`}>{config.name} 전체 메뉴 칼로리·영양성분</h2>
      <p className="nutrition-reference-description">
        전체 {count}종의 {isCatalog ? "제품 상세" : "계산기"}와 같은 영양정보입니다.
        {isCatalog
          ? " 제품별 표시 중량과 영양성분을 함께 확인하세요."
          : " 메뉴·재료별 수치이므로 선택한 구성에 따라 합계가 달라집니다."}
        {" "}미기재 값은 —로 표시하며 0을 뜻하지 않습니다.
      </p>
      {config.tip && <p className="nutrition-reference-tip">{config.tip}</p>}
      <p className="nutrition-reference-scroll-hint">표를 좌우로 밀면 모든 영양성분을 볼 수 있습니다.</p>
      <div className="nutrition-reference-categories">
        {config.categories.map((category, index) => (
          <details className="nutrition-reference-category" key={category.id} open={!isCatalog && index === 0}>
            <summary>
              <h3>{category.label} 영양성분</h3>
              <span>{category.items.length}종</span>
            </summary>
            <div
              className="nutrition-reference-table-wrap"
              role="region"
              aria-label={`${config.name} ${category.label} 영양성분 표`}
              tabIndex={0}
            >
              <table className="nutrition-reference-table">
                <caption>{config.name} {category.label} 메뉴별 영양성분과 단위</caption>
                <thead>
                  <tr>
                    <th scope="col">제품명</th>
                    {config.nutritionKeys.map(({ key, label, unit }) => (
                      <th scope="col" key={key}>{label}<span>({unit})</span></th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {category.items.map((item) => (
                    <tr key={item.name} id={nutritionItemId(config.id, category.id, item.name)}>
                      <th scope="row">
                        {item.name}
                        {item.noNutrition && <span className="nutrition-reference-product-note">영양정보 준비 중</span>}
                        {item.nutritionNote && <span className="nutrition-reference-product-note">{item.nutritionNote}</span>}
                      </th>
                      {config.nutritionKeys.map(({ key }) => (
                        <td key={key}>{nutritionValue(item, key)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
