"use client";
import { useState, useMemo, useCallback } from "react";
import { getBrandConfig, brands } from "../../data/brands";
import { useCalculator } from "../../hooks/useCalculator";
import type { MenuItem } from "../../data/types";
import { catalogStats, catalogFaqs } from "../../lib/catalogSeo";
import TopNav from "../../components/TopNav";
import SiteFooter from "../../components/SiteFooter";

const MAX_DROPDOWN = 8;

function Triangle() {
  return (
    <svg className="y-tri" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 16 L84 80 L16 80 Z" fill="none" stroke="#c9ab88" strokeWidth={6} strokeLinejoin="round" />
      <circle cx={41} cy={60} r={3.2} fill="#c9ab88" />
      <circle cx={56} cy={53} r={3.2} fill="#c9ab88" />
      <circle cx={52} cy={69} r={3.2} fill="#c9ab88" />
    </svg>
  );
}

function Thumb({ item }: { item: MenuItem }) {
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/yundar/${item.image}`} alt={item.name} loading="lazy" />;
  }
  return (
    <div className="y-ph">
      <Triangle />
    </div>
  );
}

export default function CatalogClient({ brandId }: { brandId: string }) {
  const config = getBrandConfig(brandId) ?? brands[0];
  const categories = config.categories;

  const { selected, selectedItems, totals, toggle, remove } = useCalculator(config.nutritionKeys);

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "");
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const q = query.trim().toLowerCase();

  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories]);
  const activeItems = useMemo(
    () => categories.find((c) => c.id === activeCat)?.items ?? [],
    [categories, activeCat]
  );
  // 검색어가 있으면 전체 카테고리에서, 없으면 선택한 카테고리에서
  const filtered = useMemo(
    () => (q ? allItems.filter((it) => it.name.toLowerCase().includes(q)) : activeItems),
    [q, allItems, activeItems]
  );
  const dropdown = useMemo(() => (q ? filtered.slice(0, MAX_DROPDOWN) : []), [q, filtered]);

  const openDetail = useCallback((item: MenuItem) => {
    setDetail(item);
    setFocused(false);
  }, []);

  const photoCount = useMemo(() => allItems.filter((it) => it.image).length, [allItems]);
  // SEO 통계·FAQ는 대표 라인(삼각이 = 첫 카테고리) 기준
  const samgakItems = useMemo(() => categories[0]?.items ?? [], [categories]);
  const stats = useMemo(() => catalogStats(samgakItems), [samgakItems]);
  const faqs = useMemo(() => catalogFaqs(config.name, stats), [config.name, stats]);

  return (
    <>
      <TopNav activeBrand={config.id} />

      <header className="page-header">
        <h1>{config.name}</h1>
        <p className="sub">{config.subtitle}</p>
        <span className="tag">전체 {allItems.length}종 · 사진 {photoCount}종</span>
      </header>

      <p className="y-intro">
        {config.name} <b>삼각이</b>는 비정제 통밀·현미로 만든 저당·고식이섬유 비건 스콘입니다.
        전체 {stats.count}종의 <b>칼로리·영양성분</b>(단백질·식이섬유·당류·지방)을 사진과 함께 확인하고,
        맛을 검색해 장바구니에 담아보세요. 칼로리는 개당 약 {stats.kcalMin}~{stats.kcalMax}kcal입니다.
      </p>

      {/* -- Search with typeahead -- */}
      <div className="y-search-wrap">
        <div className="y-search-box">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            placeholder="제품 검색 (예: 딸기, 말차, 크림빵)"
            aria-label="윤달베이커리 제품 검색"
          />
          {query && (
            <button className="y-clear" onClick={() => setQuery("")} aria-label="검색 지우기">
              ✕
            </button>
          )}
        </div>
        {focused && dropdown.length > 0 && (
          <ul className="y-search-drop">
            {dropdown.map((it) => (
              <li
                key={it.name}
                className="y-drop-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  openDetail(it);
                }}
              >
                <div className="y-drop-thumb">
                  <Thumb item={it} />
                </div>
                <span className="y-drop-name">{it.name}</span>
                {!it.noNutrition && <span className="y-drop-kcal">{it.calories}kcal</span>}
              </li>
            ))}
            {filtered.length > dropdown.length && (
              <li className="y-drop-more">외 {filtered.length - dropdown.length}종 더 있어요</li>
            )}
          </ul>
        )}
      </div>

      {/* -- Category pills -- */}
      {categories.length > 1 && (
        <div className="y-cat-pills" role="tablist" aria-label="제품 카테고리">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === activeCat && !q}
              className={`y-cat-pill${c.id === activeCat && !q ? " active" : ""}`}
              onClick={() => {
                setActiveCat(c.id);
                setQuery("");
              }}
            >
              <span aria-hidden="true">{c.icon}</span> {c.label}
              <span className="y-pill-cnt">{c.items.length}</span>
            </button>
          ))}
        </div>
      )}

      {/* -- Photo catalog grid -- */}
      <div className="y-cat-grid">
        {filtered.map((it) => (
          <button
            key={it.name}
            className={`y-cat-card${selected.has(it.name) ? " in-cart" : ""}`}
            onClick={() => openDetail(it)}
          >
            <div className="y-cat-thumb">
              <Thumb item={it} />
              {selected.has(it.name) && <span className="y-incart-badge">담김 ✓</span>}
            </div>
            <div className="y-cat-name">{it.name}</div>
            {it.noNutrition ? (
              <div className="y-cat-kcal muted">영양정보 준비중</div>
            ) : (
              <div className="y-cat-kcal">{it.calories} kcal</div>
            )}
          </button>
        ))}
        {filtered.length === 0 && <div className="y-empty">검색 결과가 없어요 🥲</div>}
      </div>

      {/* -- SEO: crawlable summary + FAQ (visible; mirrors FAQPage JSON-LD) -- */}
      <section className="y-seo" aria-label={`${config.name} 삼각이 영양성분 요약 및 자주 묻는 질문`}>
        <h2>{config.name} 삼각이 칼로리·영양성분 요약</h2>
        <ul className="y-seo-stats">
          <li>전체 <b>{stats.count}종</b> · 사진 {stats.photoCount}종</li>
          <li>칼로리 <b>{stats.kcalMin}~{stats.kcalMax}kcal</b> (평균 {stats.kcalAvg}kcal)</li>
          <li>최저 칼로리 <b>{stats.lowKcalName}</b> {stats.kcalMin}kcal</li>
          <li>최고 단백질 <b>{stats.highProteinName}</b> {stats.proteinMax}g</li>
          <li>식이섬유 {stats.fiberMin}~{stats.fiberMax}g · 당류 {stats.sugarMin}~{stats.sugarMax}g</li>
        </ul>

        <h2>자주 묻는 질문</h2>
        <div className="y-faq">
          {faqs.map((f) => (
            <details key={f.q} className="y-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />

      {/* -- Cart bar -- */}
      <div className="bot-bar">
        <div className="info">
          <div className="lbl">장바구니</div>
          <div className="val">
            {selectedItems.length} <span className="unit">개</span>
          </div>
        </div>
        <button className="cta" onClick={() => setCartOpen(true)} disabled={selectedItems.length === 0}>
          장바구니 보기
        </button>
      </div>

      {/* -- Product detail modal -- */}
      <div
        className={`overlay${detail ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDetail(null);
        }}
      >
        <div className="sheet">
          <div className="handle" />
          {detail && (
            <>
              <div className="y-prod-photo">
                <Thumb item={detail} />
              </div>
              <h2>{detail.name}</h2>
              {detail.desc && <div className="sheet-sub">{detail.desc}</div>}
              {detail.noNutrition ? (
                <div className="y-prod-none">영양정보 준비중이에요</div>
              ) : (
                <div className="y-prod-nutri">
                  {config.nutritionKeys.map((nk, i) => {
                    const v = detail[nk.key];
                    return (
                      <div key={nk.key} className={`n-row${i === 0 ? " hi" : ""}`}>
                        <div className="n-lbl">{nk.label}</div>
                        <div className="n-val">
                          {typeof v === "number" ? v : "-"}
                          {nk.unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {detail.nutritionNote && <p className="y-prod-note">※ {detail.nutritionNote}</p>}
              <div className="share-row">
                <button className="btn-s" onClick={() => setDetail(null)}>
                  닫기
                </button>
                <button
                  className={selected.has(detail.name) ? "btn-s" : "btn-p"}
                  onClick={() => toggle(detail)}
                >
                  {selected.has(detail.name) ? "장바구니에서 빼기" : "장바구니에 넣기"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* -- Cart modal -- */}
      <div
        className={`overlay${cartOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setCartOpen(false);
        }}
      >
        <div className="sheet">
          <div className="handle" />
          <h2>내 장바구니</h2>
          <div className="sheet-sub">담은 제품 {selectedItems.length}종</div>
          {selectedItems.length === 0 ? (
            <div className="y-prod-none">아직 담은 제품이 없어요</div>
          ) : (
            <>
              <ul className="y-cart-list">
                {selectedItems.map((it) => (
                  <li key={it.name} className="y-cart-item">
                    <div className="y-cart-thumb">
                      <Thumb item={it} />
                    </div>
                    <span className="y-cart-name">{it.name}</span>
                    <span className="y-cart-kcal">{it.noNutrition ? "-" : `${it.calories}kcal`}</span>
                    <button className="y-cart-x" onClick={() => remove(it.name)} aria-label={`${it.name} 빼기`}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="y-cart-totals">
                <div className="y-cart-total-title">합계 영양성분</div>
                {config.nutritionKeys.map((nk, i) => (
                  <div key={nk.key} className={`n-row${i === 0 ? " hi" : ""}`}>
                    <div className="n-lbl">{nk.label}</div>
                    <div className="n-val">
                      {totals[nk.key] ?? 0}
                      {nk.unit}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="share-row">
            <button className="btn-s" onClick={() => setCartOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
