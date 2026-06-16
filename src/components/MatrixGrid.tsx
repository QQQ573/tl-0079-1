import { useMemo } from 'react';
import type { MetricKey } from '@/types';
import { METRIC_KEYS, METRIC_LABELS } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { valueToColor, valueToTextColor } from '@/utils/colorMapping';
import { BRANDS } from '@/data/mockData';
import { isTop3InCategory } from '@/store/useAppStore';
import { ChevronDown, ChevronRight, Award } from 'lucide-react';
import clsx from 'clsx';

export default function MatrixGrid() {
  const {
    skus,
    selectedSKUs,
    hoveredRowId,
    hoveredColumn,
    collapsedBrands,
    zoomLevel,
    highlightedRowId,
    filterBrandId,
    selectSKU,
    setHoveredRow,
    setHoveredColumn,
    toggleBrandCollapse,
  } = useAppStore();

  const filteredSkus = useMemo(() => {
    if (!filterBrandId) return skus;
    return skus.filter((s) => s.brandId === filterBrandId);
  }, [skus, filterBrandId]);

  const groupedSkus = useMemo(() => {
    const map = new Map<string, typeof skus>();
    for (const sku of filteredSkus) {
      if (!map.has(sku.brandId)) map.set(sku.brandId, []);
      map.get(sku.brandId)!.push(sku);
    }
    return map;
  }, [filteredSkus]);

  const selectedIds = useMemo(() => new Set(selectedSKUs.map((s) => s.id)), [selectedSKUs]);

  const getBrandMaxHeat = (brandSkus: typeof skus) => {
    return Math.max(...brandSkus.map((s) => s.salesPercentile));
  };

  return (
    <div
      className="overflow-auto flex-1 rounded-xl shadow-inner"
      style={{
        background: 'linear-gradient(135deg, #FAF6F1 0%, #F0E6D8 100%)',
        boxShadow: 'inset 0 2px 12px rgba(139,94,60,0.12)',
      }}
    >
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          transition: 'transform 200ms ease-out',
          minWidth: `${100 / zoomLevel}%`,
        }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 z-50">
              <th
                className="sticky left-0 z-50 bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] text-white px-4 py-3 text-left text-sm font-semibold min-w-[200px]"
                style={{ fontFamily: '"LXGW WenKai", serif' }}
              >
                SKU名称
              </th>
              <th
                className="sticky top-0 z-40 bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] text-white px-3 py-3 text-left text-sm min-w-[80px]"
                style={{ fontFamily: '"LXGW WenKai", serif' }}
              >
                品类
              </th>
              {METRIC_KEYS.map((key) => (
                <th
                  key={key}
                  className={clsx(
                    'sticky top-0 z-40 bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] text-white px-3 py-3 text-center text-sm min-w-[120px] transition-colors duration-150',
                    hoveredColumn === key && 'bg-[#6B4226] brightness-125'
                  )}
                  style={{ fontFamily: '"LXGW WenKai", serif' }}
                  onMouseEnter={() => setHoveredColumn(key)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  {METRIC_LABELS[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRANDS.filter((b) => !filterBrandId || b.id === filterBrandId).map((brand) => {
              const brandSkus = groupedSkus.get(brand.id) || [];
              if (brandSkus.length === 0) return null;
              const isCollapsed = collapsedBrands.has(brand.id);
              const maxHeat = getBrandMaxHeat(brandSkus);
              const heatColor = valueToColor(maxHeat);

              return (
                <BrandGroup
                  key={brand.id}
                  brand={brand}
                  isCollapsed={isCollapsed}
                  maxHeat={maxHeat}
                  heatColor={heatColor}
                  skuCount={brandSkus.length}
                  onToggle={() => toggleBrandCollapse(brand.id)}
                >
                  {brandSkus.map((sku, idx) => {
                    const isSelected = selectedIds.has(sku.id);
                    const isHovered = hoveredRowId === sku.id;
                    const isHighlighted = highlightedRowId === sku.id;
                    const isTop3 = isTop3InCategory(sku, skus);
                    const isZebra = idx % 2 === 0;

                    return (
                      <tr
                        key={sku.id}
                        id={`sku-row-${sku.id}`}
                        className={clsx(
                          'cursor-pointer transition-all duration-150',
                          isZebra ? 'bg-white/40' : 'bg-white/20',
                          isHovered && 'bg-amber-100/60',
                          isSelected && 'ring-2 ring-[#8B5E3C] ring-inset',
                          isHighlighted && 'animate-pulse-highlight'
                        )}
                        onClick={() => selectSKU(sku)}
                        onMouseEnter={() => setHoveredRow(sku.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={isSelected ? { animation: 'glow-pulse 1.2s ease-in-out infinite' } : undefined}
                      >
                        <td
                          className={clsx(
                            'sticky left-0 z-20 px-4 py-2.5 text-sm font-medium border-b border-[#E8DDD0]',
                            isZebra ? 'bg-white/90' : 'bg-[#FAF6F1]/90',
                            isHovered && 'bg-amber-50',
                          )}
                          style={{ fontFamily: '"LXGW WenKai", serif' }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: brand.color }}
                            />
                            <span>{sku.name}</span>
                            {isTop3 && (
                              <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            )}
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#8B5E3C] flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                        </td>
                        <td
                          className={clsx(
                            'px-3 py-2.5 text-xs border-b border-[#E8DDD0]',
                            isZebra ? 'bg-white/70' : 'bg-[#FAF6F1]/70',
                          )}
                        >
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-xs">
                            {sku.category}
                          </span>
                        </td>
                        {METRIC_KEYS.map((key) => {
                          const val = sku[key] as number;
                          const bg = valueToColor(val);
                          const txt = valueToTextColor(val);
                          const isColHovered = hoveredColumn === key;
                          const isCrossHighlight = isHovered && isColHovered;

                          return (
                            <td
                              key={key}
                              className={clsx(
                                'px-2 py-2 text-center border-b border-[#E8DDD0] transition-all duration-100',
                                isColHovered && !isCrossHighlight && 'brightness-110',
                                isCrossHighlight && 'ring-2 ring-[#8B5E3C] ring-inset brightness-125',
                              )}
                              onMouseEnter={() => setHoveredColumn(key)}
                              onMouseLeave={() => setHoveredColumn(null)}
                            >
                              <div
                                className="rounded-lg px-3 py-1.5 font-mono text-sm font-semibold"
                                style={{
                                  backgroundColor: bg,
                                  color: txt,
                                  fontFamily: '"JetBrains Mono", monospace',
                                }}
                              >
                                {val}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </BrandGroup>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface BrandGroupProps {
  brand: { id: string; name: string; color: string };
  isCollapsed: boolean;
  maxHeat: number;
  heatColor: string;
  skuCount: number;
  onToggle: () => void;
  children: React.ReactNode;
}

function BrandGroup({
  brand,
  isCollapsed,
  maxHeat,
  heatColor,
  skuCount,
  onToggle,
  children,
}: BrandGroupProps) {
  return (
    <>
      <tr
        className="cursor-pointer hover:bg-[#8B5E3C]/5 transition-colors"
        onClick={onToggle}
      >
        <td
          colSpan={6}
          className="px-4 py-2 border-b border-[#E8DDD0]/60"
        >
          <div className="flex items-center gap-3">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#8B5E3C]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8B5E3C]" />
            )}
            <span
              className="font-bold text-[#8B5E3C] text-sm"
              style={{ fontFamily: '"LXGW WenKai", serif' }}
            >
              {brand.name}
            </span>
            <span className="inline-flex items-center justify-center min-w-[24px] h-5 px-1.5 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] text-xs font-mono">
              {skuCount}
            </span>
            {isCollapsed && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs text-gray-400">最高热度</span>
                <div
                  className="w-16 h-4 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${heatColor}, ${heatColor}88)`,
                  }}
                />
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: heatColor }}
                >
                  {maxHeat}
                </span>
              </div>
            )}
          </div>
        </td>
      </tr>
      {!isCollapsed && children}
    </>
  );
}
