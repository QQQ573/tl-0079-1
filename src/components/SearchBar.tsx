import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

export default function SearchBar() {
  const { searchQuery, searchResults, setSearchQuery, setHighlightedRow } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setHighlightedRow(null);
    }
  }, [searchQuery, setHighlightedRow]);

  const handleSelectResult = (skuId: string) => {
    setHighlightedRow(skuId);
    const el = document.getElementById(`sku-row-${skuId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setSearchQuery('');
  };

  const showResults = isFocused && searchQuery.trim() && searchResults.length > 0;

  return (
    <div className="relative">
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-200',
          isFocused
            ? 'border-[#8B5E3C] bg-white shadow-md'
            : 'border-[#E8DDD0] bg-white/80'
        )}
      >
        <Search className="w-4 h-4 text-[#8B5E3C]/60 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="搜索SKU..."
          className="w-40 bg-transparent outline-none text-sm text-[#5C3D2E] placeholder:text-[#8B5E3C]/40"
          style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-0.5 rounded hover:bg-[#8B5E3C]/10"
          >
            <X className="w-3.5 h-3.5 text-[#8B5E3C]/40" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-white rounded-lg shadow-xl border border-[#E8DDD0] z-50 max-h-60 overflow-auto">
          {searchResults.map((sku) => (
            <button
              key={sku.id}
              className="w-full px-3 py-2 text-left text-sm hover:bg-[#8B5E3C]/5 transition-colors flex items-center gap-2"
              onClick={() => handleSelectResult(sku.id)}
              style={{ fontFamily: '"Source Han Sans CN", sans-serif' }}
            >
              <span className="font-medium text-[#5C3D2E]">{sku.name}</span>
              <span className="text-xs text-[#8B5E3C]/50">{sku.category}</span>
            </button>
          ))}
        </div>
      )}

      {isFocused && searchQuery.trim() && searchResults.length === 0 && (
        <div className="absolute top-full mt-1 left-0 w-64 bg-white rounded-lg shadow-xl border border-[#E8DDD0] z-50 px-3 py-4 text-center text-sm text-[#8B5E3C]/50">
          未找到匹配SKU
        </div>
      )}
    </div>
  );
}
