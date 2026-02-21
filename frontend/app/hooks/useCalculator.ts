"use client";
import { useState, useCallback, useMemo } from "react";
import type { MenuItem, NutritionKey } from "../data/types";

export function useCalculator(nutritionKeys: NutritionKey[]) {
  const [selected, setSelected] = useState<Map<string, MenuItem>>(new Map());

  const add = useCallback((item: MenuItem) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.set(item.name, item);
      return next;
    });
  }, []);

  const remove = useCallback((name: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const toggle = useCallback((item: MenuItem) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.name)) {
        next.delete(item.name);
      } else {
        next.set(item.name, item);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(new Map());
  }, []);

  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    for (const nk of nutritionKeys) {
      result[nk.key] = 0;
    }
    selected.forEach((item) => {
      for (const nk of nutritionKeys) {
        const val = item[nk.key];
        if (typeof val === "number") {
          result[nk.key] += val;
        }
      }
    });
    // Round all values
    for (const k of Object.keys(result)) {
      result[k] = Math.round(result[k] * 10) / 10;
    }
    return result;
  }, [selected, nutritionKeys]);

  const selectedItems = useMemo(() => Array.from(selected.values()), [selected]);
  const selectedNames = useMemo(() => new Set(selected.keys()), [selected]);

  return { selected: selectedNames, selectedItems, totals, add, remove, toggle, clear };
}
