import { ZoomIn, ZoomOut, Camera, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { exportMatrixToPng } from '@/utils/exportPng';
import { BRANDS } from '@/data/mockData';
import SearchBar from './SearchBar';
import clsx from 'clsx';

export default function Toolbar() {
  const { zoomLevel, setZoomLevel, filterBrandId, setFilterBrand, clearSelection, selectedSKUs } = useAppStore();

  const handleExport = () => {
    const el = document.getElementById('matrix-container');
    exportMatrixToPng(el);
  };

  const handleZoomIn = () => setZoomLevel(zoomLevel + 0.1);
  const handleZoomOut = () => setZoomLevel(zoomLevel - 0.1);
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      className="sticky top-0 z-[100] px-5 py-3 flex items-center gap-4 border-b border-[#E8DDD0]/60"
      style={{
        background: 'linear-gradient(90deg, #FAF6F1 0%, #F5EDE3 50%, #FAF6F1 100%)',
      }}
    >
      <div
        className="text-lg font-bold text-[#8B5E3C] mr-4 tracking-wider"
        style={{ fontFamily: '"LXGW WenKai", serif' }}
      >
        🧋 奶茶爆款矩阵
      </div>

      <div className="h-6 w-px bg-[#E8DDD0]" />

      <div className="flex items-center gap-1.5">
        <button
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border',
            !filterBrandId
              ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
              : 'bg-white/80 text-[#8B5E3C] border-[#E8DDD0] hover:border-[#8B5E3C]'
          )}
          onClick={() => setFilterBrand(null)}
          style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}
        >
          全部
        </button>
        {BRANDS.map((brand) => (
          <button
            key={brand.id}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border',
              filterBrandId === brand.id
                ? 'text-white border-transparent'
                : 'bg-white/80 border-[#E8DDD0] hover:border-[#8B5E3C]/50'
            )}
            style={{
              backgroundColor: filterBrandId === brand.id ? brand.color : undefined,
              color: filterBrandId === brand.id ? '#fff' : '#5C3D2E',
              fontFamily: '"Source Han Sans CN", sans-serif',
            }}
            onClick={() => setFilterBrand(filterBrandId === brand.id ? null : brand.id)}
          >
            {brand.name}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-[#E8DDD0]" />

      <SearchBar />

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {selectedSKUs.length > 0 && (
          <button
            onClick={clearSelection}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-[#8B5E3C]/70 hover:text-[#8B5E3C] hover:bg-[#8B5E3C]/5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            清除选择({selectedSKUs.length}/2)
          </button>
        )}

        <div className="flex items-center gap-1 bg-white/60 rounded-lg px-2 py-1 border border-[#E8DDD0]">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-[#8B5E3C]/10 transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-3.5 h-3.5 text-[#8B5E3C]" />
          </button>
          <span className="text-xs font-mono text-[#8B5E3C] w-10 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-[#8B5E3C]/10 transition-colors"
            title="放大"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#8B5E3C]" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 rounded hover:bg-[#8B5E3C]/10 transition-colors text-xs text-[#8B5E3C]/60"
            title="重置缩放"
          >
            1:1
          </button>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5E3C] text-white text-xs font-medium hover:bg-[#6B4226] transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}
        >
          <Camera className="w-3.5 h-3.5" />
          导出PNG
        </button>
      </div>
    </div>
  );
}
