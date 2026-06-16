import { AlertTriangle, X } from 'lucide-react';
import { useAppStore, isAlertCombination } from '@/store/useAppStore';
import { getMarginTierLevel } from '@/types';
import { useState } from 'react';

export default function AlertBanner() {
  const { selectedSKUs, clearSelection } = useAppStore();
  const [dismissed, setDismissed] = useState(false);

  if (selectedSKUs.length < 2) return null;
  if (dismissed) return null;

  const [sku1, sku2] = selectedSKUs;
  const isAlert = isAlertCombination(sku1, sku2);
  const salesDiff = Math.abs(sku1.salesPercentile - sku2.salesPercentile);
  const tier1 = getMarginTierLevel(sku1.marginTier);
  const tier2 = getMarginTierLevel(sku2.marginTier);
  const marginTierDiff = Math.abs(tier1 - tier2);

  return (
    <div
      className="relative flex items-center gap-3 px-5 py-2.5 border-b"
      style={{
        background: isAlert
          ? 'linear-gradient(90deg, #FF6B35, #F7931E)'
          : 'linear-gradient(90deg, #52B788, #2D6A4F)',
        borderColor: isAlert ? '#FF6B35' : '#52B788',
        zIndex: 90,
      }}
    >
      <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
      <div className="flex items-center gap-4 text-white text-sm" style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}>
        <span className="font-semibold">
          {isAlert ? '⚠️ 高销低利组合警告' : '✅ 指标组合正常'}
        </span>
        <span className="text-white/80">
          {sku1.name} vs {sku2.name}
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-white/20">
            销量分位差 {salesDiff}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/20">
            毛利档差 {marginTierDiff} 档
          </span>
        </div>
        {isAlert && (
          <span className="text-xs text-white/90">
            高销量SKU搭配低毛利，建议关注成本优化
          </span>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <X className="w-3.5 h-3.5 text-white/70" />
      </button>
    </div>
  );
}
