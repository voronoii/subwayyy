"use client";
import { useState, useCallback } from "react";
import { getBrandConfig, brands } from "../../data/brands";
import { useCalculator } from "../../hooks/useCalculator";
import TopNav from "../../components/TopNav";
import CategoryPills from "../../components/CategoryPills";
import SelectedChips from "../../components/SelectedChips";
import MenuGrid from "../../components/MenuGrid";
import BottomBar from "../../components/BottomBar";
import ResultSheet from "../../components/ResultSheet";
import TipCard from "../../components/TipCard";
import PlantModal from "../../components/PlantModal";
import SiteFooter from "../../components/SiteFooter";

export default function CalculatorClient({ brandId }: { brandId: string }) {
  const config = getBrandConfig(brandId) ?? brands[0];

  const [activeCat, setActiveCat] = useState(config.categories[0]?.id ?? "");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [plantOpen, setPlantOpen] = useState(false);

  const { selected, selectedItems, totals, toggle, remove } = useCalculator(config.nutritionKeys);

  const activeCategory = config.categories.find((c) => c.id === activeCat) ?? config.categories[0];

  const handleShowResult = useCallback(() => {
    if (selectedItems.length > 0) {
      setSheetOpen(true);
    }
  }, [selectedItems.length]);

  return (
    <>
      <TopNav activeBrand={config.id} />

      <header className="page-header">
        <h1>{config.name}</h1>
        <p className="sub">{config.subtitle}</p>
      </header>

      <CategoryPills
        categories={config.categories}
        activeId={activeCat}
        onSelect={setActiveCat}
        nutritionNote={config.nutritionNote}
      />

      <SelectedChips items={selectedItems} onRemove={remove} />

      {config.tip && <TipCard text={config.tip} />}

      {activeCategory && (
        <MenuGrid
          category={activeCategory}
          selectedNames={selected}
          onToggle={toggle}
        />
      )}

      <SiteFooter />

      <BottomBar
        totalKcal={totals.calories ?? 0}
        onShowResult={handleShowResult}
      />

      <ResultSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        totals={totals}
        nutritionKeys={config.nutritionKeys}
        selectedItems={selectedItems}
        brandName={config.name}
        onPlant={() => {
          setSheetOpen(false);
          setPlantOpen(true);
        }}
      />

      <PlantModal
        open={plantOpen}
        onClose={() => setPlantOpen(false)}
        brandId={config.id}
        menuNames={selectedItems.map((i) => i.name)}
        totalCalories={totals.calories ?? 0}
      />
    </>
  );
}
