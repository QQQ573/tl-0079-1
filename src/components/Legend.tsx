import { METRIC_KEYS, METRIC_LABELS, MARGIN_TIER_LABELS } from '@/types';
import { valueToColor } from '@/utils/colorMapping';

export default function Legend() {
  return (
    <div className="flex items-center gap-6 px-5 py-2 border-t border-[#E8DDD0]/60 bg-[#FAF6F1]/80">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#8B5E3C]/60" style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}>
          分值映射
        </span>
        <div className="flex items-center gap-0.5">
          {[0, 20, 40, 50, 60, 80, 100].map((val) => (
            <div
              key={val}
              className="w-6 h-4 rounded-sm"
              style={{ backgroundColor: valueToColor(val) }}
              title={`${val}分`}
            />
          ))}
        </div>
        <span className="text-xs text-[#8B5E3C]/40 font-mono">0-100</span>
      </div>

      <div className="h-4 w-px bg-[#E8DDD0]" />

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#8B5E3C]/60" style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}>
          分值段
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-700 text-white">80-100 高</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500 text-amber-950">50-79 中</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-400 text-gray-800">0-49 低</span>
      </div>

      <div className="h-4 w-px bg-[#E8DDD0]" />

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[#8B5E3C]/60" style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}>
          毛利档
        </span>
        {[1, 2, 3, 4, 5].map((tier) => (
          <span key={tier} className="text-xs px-1.5 py-0.5 rounded bg-[#8B5E3C]/10 text-[#8B5E3C]">
            {MARGIN_TIER_LABELS[tier]}
          </span>
        ))}
      </div>
    </div>
  );
}
