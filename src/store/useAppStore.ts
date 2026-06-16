import { create } from 'zustand';
import type { SKU, MetricKey } from '@/types';
import { SKUS, BRANDS } from '@/data/mockData';
import { getMarginTierLevel } from '@/types';

interface AppState {
  skus: SKU[];
  selectedSKUs: SKU[];
  hoveredRowId: string | null;
  hoveredColumn: MetricKey | null;
  collapsedBrands: Set<string>;
  zoomLevel: number;
  searchQuery: string;
  searchResults: SKU[];
  highlightedRowId: string | null;
  drawerOpen: boolean;
  filterBrandId: string | null;

  selectSKU: (sku: SKU) => void;
  clearSelection: () => void;
  setHoveredRow: (id: string | null) => void;
  setHoveredColumn: (col: MetricKey | null) => void;
  toggleBrandCollapse: (brandId: string) => void;
  setZoomLevel: (level: number) => void;
  setSearchQuery: (query: string) => void;
  setHighlightedRow: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilterBrand: (brandId: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  skus: SKUS,
  selectedSKUs: [],
  hoveredRowId: null,
  hoveredColumn: null,
  collapsedBrands: new Set<string>(),
  zoomLevel: 1,
  searchQuery: '',
  searchResults: [],
  highlightedRowId: null,
  drawerOpen: false,
  filterBrandId: null,

  selectSKU: (sku) =>
    set((state) => {
      const exists = state.selectedSKUs.find((s) => s.id === sku.id);
      if (exists) {
        const newSelected = state.selectedSKUs.filter((s) => s.id !== sku.id);
        return {
          selectedSKUs: newSelected,
          drawerOpen: newSelected.length === 2,
        };
      }
      let newSelected: SKU[];
      if (state.selectedSKUs.length >= 2) {
        newSelected = [state.selectedSKUs[1], sku];
      } else {
        newSelected = [...state.selectedSKUs, sku];
      }
      return {
        selectedSKUs: newSelected,
        drawerOpen: newSelected.length === 2,
      };
    }),

  clearSelection: () =>
    set({ selectedSKUs: [], drawerOpen: false }),

  setHoveredRow: (id) => set({ hoveredRowId: id }),
  setHoveredColumn: (col) => set({ hoveredColumn: col }),

  toggleBrandCollapse: (brandId) =>
    set((state) => {
      const next = new Set(state.collapsedBrands);
      if (next.has(brandId)) {
        next.delete(brandId);
      } else {
        next.add(brandId);
      }
      return { collapsedBrands: next };
    }),

  setZoomLevel: (level) => set({ zoomLevel: Math.max(0.6, Math.min(1.5, level)) }),

  setSearchQuery: (query) =>
    set((state) => {
      if (!query.trim()) {
        return { searchQuery: query, searchResults: [] };
      }
      const filtered = state.skus.filter((sku) =>
        sku.name.toLowerCase().includes(query.toLowerCase())
      );
      return { searchQuery: query, searchResults: filtered };
    }),

  setHighlightedRow: (id) => set({ highlightedRowId: id }),

  setDrawerOpen: (open) => set({ drawerOpen: open }),

  setFilterBrand: (brandId) => set({ filterBrandId: brandId }),
}));

export function isAlertCombination(sku1: SKU, sku2: SKU): boolean {
  const salesDiff = Math.abs(sku1.salesPercentile - sku2.salesPercentile);
  const tier1 = getMarginTierLevel(sku1.marginTier);
  const tier2 = getMarginTierLevel(sku2.marginTier);
  const marginTierDiff = Math.abs(tier1 - tier2);
  return salesDiff >= 30 && marginTierDiff >= 2;
}

export function getCategoryTop3(skus: SKU[], category: string): SKU[] {
  return skus
    .filter((s) => s.category === category)
    .sort((a, b) => b.salesPercentile - a.salesPercentile)
    .slice(0, 3);
}

export function isTop3InCategory(sku: SKU, allSkus: SKU[]): boolean {
  const top3 = getCategoryTop3(allSkus, sku.category);
  return top3.some((s) => s.id === sku.id);
}
