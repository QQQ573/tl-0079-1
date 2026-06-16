/*
 * 已知行为标注（当前代码实现 bug）:
 * AlertBanner 的 dismissed 状态为组件本地 useState(false)，
 * 仅在组件首次挂载时初始化为 false。由于组件从未卸载
 * (父组件 MatrixPage 始终渲染 <AlertBanner />，内部用 return null 控制显隐)，
 * 用户点 X 关闭一次后，无论如何换选 SKU 对，dismissed 永远为 true，
 * 横幅永远不再出现。这与运营预期（每次换选都应重新显示结论）不符。
 * 下方测试会如实反映这一现状。
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlertBanner from '../AlertBanner';
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

const HIGH_SALES_LOW_MARGIN: SKU = createSKU({
  id: 'mx-2',
  name: '冰鲜柠檬水',
  salesPercentile: 95,
  marginTier: 18,
});

const LOW_SALES_HIGH_MARGIN: SKU = createSKU({
  id: 'xc-6',
  name: '纯绿妍茶',
  salesPercentile: 35,
  marginTier: 90,
});

const NORMAL_SKU_A: SKU = createSKU({
  id: 'xc-1',
  name: '多肉葡萄',
  salesPercentile: 95,
  marginTier: 55,
});

const NORMAL_SKU_B: SKU = createSKU({
  id: 'xc-4',
  name: '芝芝莓莓',
  salesPercentile: 88,
  marginTier: 50,
});

vi.mock('@/store/useAppStore', async () => {
  const actual = await vi.importActual('@/store/useAppStore');
  return {
    ...actual,
    useAppStore: vi.fn(() => ({
      selectedSKUs: [] as SKU[],
      clearSelection: vi.fn(),
    })),
  };
});

import { useAppStore } from '@/store/useAppStore';

describe('AlertBanner', () => {
  let mockSelectedSKUs: SKU[];
  let mockClearSelection: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedSKUs = [];
    mockClearSelection = vi.fn();

    (useAppStore as any).mockImplementation((selector: any) => {
      const state = {
        selectedSKUs: mockSelectedSKUs,
        clearSelection: mockClearSelection,
      };
      return selector ? selector(state) : state;
    });
  });

  it('returns null when fewer than 2 SKUs selected', () => {
    mockSelectedSKUs = [HIGH_SALES_LOW_MARGIN];
    const { container } = render(<AlertBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('shows orange warning banner for high-sales low-margin combination', () => {
    mockSelectedSKUs = [HIGH_SALES_LOW_MARGIN, LOW_SALES_HIGH_MARGIN];
    render(<AlertBanner />);

    expect(screen.getByText('⚠️ 高销低利组合警告')).toBeInTheDocument();
    expect(screen.getByText('冰鲜柠檬水 vs 纯绿妍茶')).toBeInTheDocument();
    expect(screen.getByText(/销量分位差 60/)).toBeInTheDocument();
    expect(screen.getByText(/毛利档差 4 档/)).toBeInTheDocument();
    expect(screen.getByText('高销量SKU搭配低毛利，建议关注成本优化')).toBeInTheDocument();

    const banner = screen.getByText('⚠️ 高销低利组合警告').closest('.border-b');
    expect(banner).toHaveStyle({ borderColor: 'rgb(255, 107, 53)' });
  });

  it('shows green normal banner for non-alert combination', () => {
    mockSelectedSKUs = [NORMAL_SKU_A, NORMAL_SKU_B];
    render(<AlertBanner />);

    expect(screen.getByText('✅ 指标组合正常')).toBeInTheDocument();
    expect(screen.getByText('多肉葡萄 vs 芝芝莓莓')).toBeInTheDocument();
    expect(screen.getByText(/销量分位差 7/)).toBeInTheDocument();
    expect(screen.getByText(/毛利档差 0 档/)).toBeInTheDocument();

    const banner = screen.getByText('✅ 指标组合正常').closest('.border-b');
    expect(banner).toHaveStyle({ borderColor: 'rgb(82, 183, 136)' });
  });

  it('hides banner when close (X) button is clicked', () => {
    mockSelectedSKUs = [HIGH_SALES_LOW_MARGIN, LOW_SALES_HIGH_MARGIN];
    render(<AlertBanner />);

    expect(screen.getByText('⚠️ 高销低利组合警告')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText('⚠️ 高销低利组合警告')).not.toBeInTheDocument();
  });

  /*
   * 以下用例反映当前代码的已知 bug：
   * 换选 SKU 后，dismissed 状态没有重置，横幅不会重新出现。
   * 这是因为 AlertBanner 的 dismissed 是本地 useState，
   * 且组件从未卸载，所以 setDismissed(true) 后永远不会变回 false。
   *
   * 期望行为（运营预期）：换选后横幅应重新显示新组合的结论。
   * 实际行为（代码现状）：横幅保持隐藏。
   */
  it('[BUG] after dismissing and switching SKU pair, banner stays hidden (known issue)', () => {
    mockSelectedSKUs = [HIGH_SALES_LOW_MARGIN, LOW_SALES_HIGH_MARGIN];
    const { rerender } = render(<AlertBanner />);

    expect(screen.getByText('⚠️ 高销低利组合警告')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('⚠️ 高销低利组合警告')).not.toBeInTheDocument();

    // 换选一对新的 SKU（仍然构成告警）
    mockSelectedSKUs = [
      createSKU({ id: 'mx-1', name: '棒打鲜橙', salesPercentile: 92, marginTier: 25 }),
      createSKU({ id: 'nx-10', name: '金色山脉', salesPercentile: 30, marginTier: 92 }),
    ];

    rerender(<AlertBanner />);

    // 当前实现 bug：横幅仍然不显示（dismissed 未重置）
    // 这会导致与抽屉、矩阵角标的结论不一致
    expect(screen.queryByText('⚠️ 高销低利组合警告')).not.toBeInTheDocument();
  });

  /*
   * 验证"档差恰好为2 但销量差不足"的非告警场景
   * 对应审计报告中的反例：xc-8 酷黑莓桑 vs xc-6 纯绿妍茶
   */
  it('shows normal banner when marginTierDiff=2 but salesDiff<30 (档差2但销量差不足)', () => {
    const sku1 = createSKU({
      id: 'xc-8',
      name: '酷黑莓桑',
      salesPercentile: 55,
      marginTier: 52,
    });
    const sku2 = createSKU({
      id: 'xc-6',
      name: '纯绿妍茶',
      salesPercentile: 35,
      marginTier: 90,
    });

    mockSelectedSKUs = [sku1, sku2];
    render(<AlertBanner />);

    expect(screen.getByText('✅ 指标组合正常')).toBeInTheDocument();
    expect(screen.getByText(/销量分位差 20/)).toBeInTheDocument();
    expect(screen.getByText(/毛利档差 2 档/)).toBeInTheDocument();
  });

  it('79 vs 81 marginTier correctly shows 1档 difference', () => {
    const sku1 = createSKU({
      id: 'test-79',
      name: '毛利79SKU',
      salesPercentile: 90,
      marginTier: 79,
    });
    const sku2 = createSKU({
      id: 'test-81',
      name: '毛利81SKU',
      salesPercentile: 20,
      marginTier: 81,
    });

    mockSelectedSKUs = [sku1, sku2];
    render(<AlertBanner />);

    expect(screen.getByText('✅ 指标组合正常')).toBeInTheDocument();
    expect(screen.getByText(/毛利档差 1 档/)).toBeInTheDocument();
  });
});
