import { X, ArrowRight, Award } from 'lucide-react';
import { useAppStore, isTop3InCategory, isAlertCombination } from '@/store/useAppStore';
import { METRIC_KEYS, METRIC_LABELS, getMarginTierLevel } from '@/types';
import { BRANDS } from '@/data/mockData';
import { valueToColor, valueToTextColor } from '@/utils/colorMapping';
import RadarCompare from './RadarCompare';
import clsx from 'clsx';

export default function ComparisonDrawer() {
  const { selectedSKUs, drawerOpen, setDrawerOpen, skus, selectSKU } = useAppStore();

  if (!drawerOpen || selectedSKUs.length < 2) return null;

  const [sku1, sku2] = selectedSKUs;
  const brand1 = BRANDS.find((b) => b.id === sku1.brandId);
  const brand2 = BRANDS.find((b) => b.id === sku2.brandId);
  const isAlert = isAlertCombination(sku1, sku2);
  const sku1Top3 = isTop3InCategory(sku1, skus);
  const sku2Top3 = isTop3InCategory(sku2, skus);
  const bothTop3 = sku1Top3 && sku2Top3 && sku1.category === sku2.category;
  const sameCategory = sku1.category === sku2.category;

  return (
    <div
      className="fixed right-0 top-0 h-full w-[360px] z-[200] shadow-2xl border-l border-[#E8DDD0]/60 overflow-auto"
      style={{
        background: 'rgba(250, 246, 241, 0.95)',
        backdropFilter: 'blur(12px)',
        animation: 'drawerSlideIn 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#E8DDD0]/60 bg-[#FAF6F1]/90 backdrop-blur-sm">
        <span
          className="font-bold text-[#8B5E3C] text-sm"
          style={{ fontFamily: '"LXGW WenKai", serif' }}
        >
          SKU对比
        </span>
        <button
          onClick={() => setDrawerOpen(false)}
          className="p-1.5 rounded-lg hover:bg-[#8B5E3C]/10 transition-colors"
        >
          <X className="w-4 h-4 text-[#8B5E3C]" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="flex-1 p-3 rounded-xl border-2"
            style={{ borderColor: brand1?.color, backgroundColor: `${brand1?.color}08` }}
          >
            <div className="text-xs text-[#8B5E3C]/60 mb-1">{brand1?.name}</div>
            <div className="font-bold text-sm text-[#5C3D2E]" style={{ fontFamily: '"LXGW WenKai", serif' }}>
              {sku1.name}
            </div>
            <div className="text-xs text-[#8B5E3C]/50 mt-1">{sku1.category}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#8B5E3C]/30 flex-shrink-0" />
          <div
            className="flex-1 p-3 rounded-xl border-2"
            style={{ borderColor: brand2?.color, backgroundColor: `${brand2?.color}08` }}
          >
            <div className="text-xs text-[#8B5E3C]/60 mb-1">{brand2?.name}</div>
            <div className="font-bold text-sm text-[#5C3D2E]" style={{ fontFamily: '"LXGW WenKai", serif' }}>
              {sku2.name}
            </div>
            <div className="text-xs text-[#8B5E3C]/50 mt-1">{sku2.category}</div>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-4 border border-[#E8DDD0]/60">
          <div
            className="text-xs font-semibold text-[#8B5E3C] mb-3"
            style={{ fontFamily: '"LXGW WenKai", serif' }}
          >
            四指标雷达对比
          </div>
          <RadarCompare sku1={sku1} sku2={sku2} />
        </div>

        <div className="bg-white/70 rounded-xl p-4 border border-[#E8DDD0]/60">
          <div
            className="text-xs font-semibold text-[#8B5E3C] mb-3"
            style={{ fontFamily: '"LXGW WenKai", serif' }}
          >
            指标对比表
          </div>
          <div className="space-y-2">
            {METRIC_KEYS.map((key) => {
              const v1 = sku1[key] as number;
              const v2 = sku2[key] as number;
              const diff = v1 - v2;
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="w-20 text-xs text-[#8B5E3C]/70 flex-shrink-0">
                    {METRIC_LABELS[key]}
                  </span>
                  <div
                    className="w-10 h-6 rounded text-center leading-6 text-xs font-mono font-semibold"
                    style={{
                      backgroundColor: valueToColor(v1),
                      color: valueToTextColor(v1),
                    }}
                  >
                    {v1}
                  </div>
                  <span className={clsx(
                    'text-xs font-mono font-bold',
                    diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                  <div
                    className="w-10 h-6 rounded text-center leading-6 text-xs font-mono font-semibold"
                    style={{
                      backgroundColor: valueToColor(v2),
                      color: valueToTextColor(v2),
                    }}
                  >
                    {v2}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-4 border border-[#E8DDD0]/60 space-y-3">
          <div
            className="text-xs font-semibold text-[#8B5E3C]"
            style={{ fontFamily: '"LXGW WenKai", serif' }}
          >
            品类Top3归属判定
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5C3D2E]">{sku1.name}</span>
            {sku1Top3 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <Award className="w-3 h-3" />
                {sku1.category}Top3
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                非{sku1.category}Top3
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5C3D2E]">{sku2.name}</span>
            {sku2Top3 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <Award className="w-3 h-3" />
                {sku2.category}Top3
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                非{sku2.category}Top3
              </span>
            )}
          </div>

          {bothTop3 && (
            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              ⚡ 两款SKU同属{sku1.category}品类Top3，且指标走势{isAlert ? '相反' : '相近'}
            </div>
          )}

          {!sameCategory && (
            <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600">
              ℹ️ 两款SKU属于不同品类（{sku1.category} vs {sku2.category}），无法直接Top3对比
            </div>
          )}
        </div>

        {isAlert && (
          <div
            className="rounded-xl p-4 border-2 border-[#FF6B35]/40"
            style={{
              background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">⚠️</span>
              <span className="font-bold text-[#E65100] text-sm" style={{ fontFamily: '"LXGW WenKai", serif' }}>
                高销低利组合
              </span>
            </div>
            <div className="text-xs text-[#BF360C]/80 space-y-1" style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}>
              <p>销量分位差 {Math.abs(sku1.salesPercentile - sku2.salesPercentile)} ≥ 30</p>
              <p>毛利档差 {Math.abs(getMarginTierLevel(sku1.marginTier) - getMarginTierLevel(sku2.marginTier))} 档 ≥ 2档</p>
              <p className="mt-2 text-[#8B5E3C]">高销量SKU与低毛利SKU搭配，建议关注成本结构优化。</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            useAppStore.getState().clearSelection();
          }}
          className="w-full py-2 rounded-lg border-2 border-[#E8DDD0] text-xs text-[#8B5E3C]/60 hover:border-[#8B5E3C]/30 hover:text-[#8B5E3C] transition-all"
          style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}
        >
          清除选择
        </button>
      </div>
    </div>
  );
}
