import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, isAlertCombination, getCategoryTop3, isTop3InCategory } from '../useAppStore';
import type { SKU } from '@/types';

const createSKU = (partial: Partial<SKU>): SKU => ({
  id: 'test-1',
  name: '测试SKU',
  brandId: 'xiCha',
  category: '水果茶',
  salesPercentile: 50,
  repurchaseRate: 50,
  socialMention: 50,
  marginTier: 50,
  ...partial,
});

describe('isAlertCombination', () => {
  it('returns true when both conditions met (salesDiff >=30 AND marginTierDiff >=2)', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 95, marginTier: 18 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 45, marginTier: 55 });
    expect(isAlertCombination(sku1, sku2)).toBe(true);
  });

  it('returns false when marginTierDiff is exactly 2 but salesDiff < 30', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 55, marginTier: 52 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 35, marginTier: 90 });
    expect(isAlertCombination(sku1, sku2)).toBe(false);
  });

  it('returns false when salesDiff >= 30 but marginTierDiff < 2', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 95, marginTier: 55 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 45, marginTier: 60 });
    expect(isAlertCombination(sku1, sku2)).toBe(false);
  });

  it('returns false when neither condition met', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 50, marginTier: 50 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 55, marginTier: 55 });
    expect(isAlertCombination(sku1, sku2)).toBe(false);
  });

  it('handles 79 vs 81 marginTier: tierDiff = 1, no alert', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 90, marginTier: 79 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 20, marginTier: 81 });
    expect(isAlertCombination(sku1, sku2)).toBe(false);
  });

  it('marginTierDiff exactly 2 triggers alert when salesDiff also >=30', () => {
    const sku1 = createSKU({ id: 'a', salesPercentile: 90, marginTier: 18 });
    const sku2 = createSKU({ id: 'b', salesPercentile: 20, marginTier: 55 });
    expect(isAlertCombination(sku1, sku2)).toBe(true);
  });
});

describe('getCategoryTop3', () => {
  const allSkus: SKU[] = [
    createSKU({ id: '1', category: '水果茶', salesPercentile: 95, name: 'A' }),
    createSKU({ id: '2', category: '水果茶', salesPercentile: 95, name: 'B' }),
    createSKU({ id: '3', category: '水果茶', salesPercentile: 88, name: 'C' }),
    createSKU({ id: '4', category: '水果茶', salesPercentile: 82, name: 'D' }),
    createSKU({ id: '5', category: '奶茶', salesPercentile: 90, name: 'E' }),
  ];

  it('returns top 3 by salesPercentile descending', () => {
    const top3 = getCategoryTop3(allSkus, '水果茶');
    expect(top3).toHaveLength(3);
    expect(top3[0].salesPercentile).toBe(95);
    expect(top3[1].salesPercentile).toBe(95);
    expect(top3[2].salesPercentile).toBe(88);
  });

  it('filters by category correctly', () => {
    const top3 = getCategoryTop3(allSkus, '奶茶');
    expect(top3).toHaveLength(1);
    expect(top3[0].id).toBe('5');
  });

  it('returns empty array for unknown category', () => {
    const top3 = getCategoryTop3(allSkus, '咖啡');
    expect(top3).toHaveLength(0);
  });
});

describe('isTop3InCategory', () => {
  const allSkus: SKU[] = [
    createSKU({ id: '1', category: '水果茶', salesPercentile: 95 }),
    createSKU({ id: '2', category: '水果茶', salesPercentile: 90 }),
    createSKU({ id: '3', category: '水果茶', salesPercentile: 85 }),
    createSKU({ id: '4', category: '水果茶', salesPercentile: 80 }),
  ];

  it('returns true for top 3 SKUs', () => {
    expect(isTop3InCategory(allSkus[0], allSkus)).toBe(true);
    expect(isTop3InCategory(allSkus[1], allSkus)).toBe(true);
    expect(isTop3InCategory(allSkus[2], allSkus)).toBe(true);
  });

  it('returns false for SKU outside top 3', () => {
    expect(isTop3InCategory(allSkus[3], allSkus)).toBe(false);
  });

  it('matches by id, not by name or index', () => {
    const skuCopy: SKU = { ...allSkus[0], id: 'different-id' };
    expect(isTop3InCategory(skuCopy, allSkus)).toBe(false);
  });
});

describe('useAppStore - selectSKU behavior', () => {
  beforeEach(() => {
    useAppStore.getState().clearSelection();
  });

  it('selects first SKU but drawer remains closed', () => {
    const sku1 = createSKU({ id: 'sku-1' });
    useAppStore.getState().selectSKU(sku1);
    expect(useAppStore.getState().selectedSKUs).toHaveLength(1);
    expect(useAppStore.getState().drawerOpen).toBe(false);
  });

  it('opens drawer when 2 SKUs selected', () => {
    const sku1 = createSKU({ id: 'sku-1' });
    const sku2 = createSKU({ id: 'sku-2' });
    useAppStore.getState().selectSKU(sku1);
    useAppStore.getState().selectSKU(sku2);
    expect(useAppStore.getState().selectedSKUs).toHaveLength(2);
    expect(useAppStore.getState().drawerOpen).toBe(true);
  });

  it('deselects SKU when clicked again, closes drawer if going from 2 to 1', () => {
    const sku1 = createSKU({ id: 'sku-1' });
    const sku2 = createSKU({ id: 'sku-2' });
    useAppStore.getState().selectSKU(sku1);
    useAppStore.getState().selectSKU(sku2);
    useAppStore.getState().selectSKU(sku1);
    expect(useAppStore.getState().selectedSKUs).toHaveLength(1);
    expect(useAppStore.getState().drawerOpen).toBe(false);
  });

  it('replaces first SKU when selecting third (shift behavior)', () => {
    const sku1 = createSKU({ id: 'sku-1' });
    const sku2 = createSKU({ id: 'sku-2' });
    const sku3 = createSKU({ id: 'sku-3' });
    useAppStore.getState().selectSKU(sku1);
    useAppStore.getState().selectSKU(sku2);
    useAppStore.getState().selectSKU(sku3);
    expect(useAppStore.getState().selectedSKUs.map(s => s.id)).toEqual(['sku-2', 'sku-3']);
    expect(useAppStore.getState().drawerOpen).toBe(true);
  });

  it('clearSelection resets state', () => {
    const sku1 = createSKU({ id: 'sku-1' });
    const sku2 = createSKU({ id: 'sku-2' });
    useAppStore.getState().selectSKU(sku1);
    useAppStore.getState().selectSKU(sku2);
    useAppStore.getState().clearSelection();
    expect(useAppStore.getState().selectedSKUs).toHaveLength(0);
    expect(useAppStore.getState().drawerOpen).toBe(false);
  });

  it('setSearchQuery filters SKUs by name (case insensitive)', () => {
    useAppStore.getState().setSearchQuery('葡萄');
    const results = useAppStore.getState().searchResults;
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(s => s.name.toLowerCase().includes('葡萄'))).toBe(true);
  });

  it('setSearchQuery empty resets searchResults', () => {
    useAppStore.getState().setSearchQuery('葡萄');
    expect(useAppStore.getState().searchResults.length).toBeGreaterThan(0);
    useAppStore.getState().setSearchQuery('');
    expect(useAppStore.getState().searchResults).toHaveLength(0);
  });
});
