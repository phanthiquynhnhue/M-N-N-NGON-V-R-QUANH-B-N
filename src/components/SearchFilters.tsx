import React, { useState } from 'react';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Wallet,
  Clock,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  CATEGORIES,
  BUDGET_OPTIONS,
  POPULAR_LOCATIONS,
  AMENITY_TAGS
} from '../data/constants';

interface SearchFiltersProps {
  location: string;
  setLocation: (loc: string) => void;
  selectedBudget: string;
  setSelectedBudget: (budget: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  extraNotes: string;
  setExtraNotes: (notes: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  location,
  setLocation,
  selectedBudget,
  setSelectedBudget,
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  toggleTag,
  extraNotes,
  setExtraNotes,
  onSearch,
  isLoading,
  onUseCurrentLocation,
  isLocating
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Find active budget item
  const currentBudgetObj = BUDGET_OPTIONS.find((b) => b.label === selectedBudget) || BUDGET_OPTIONS[1];

  const handlePresetLocation = (query: string) => {
    setLocation(query);
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 shadow-sm p-4 sm:p-6 transition-all">
      {/* 1. KHU VỰC / ĐỊA ĐIỂM */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-600" />
            Khu vực / Trường học / Địa danh
          </label>
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Đang định vị...' : 'Vị trí hiện tại'}
          </button>
        </div>

        {/* Input box */}
        <div className="relative mb-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ví dụ: Quận Bình Thạnh, Gần ĐH Ngân Hàng, Làng Đại Học..."
            className="w-full pl-10 pr-4 py-3 bg-purple-50/30 hover:bg-purple-50/60 focus:bg-white border border-stone-200 focus:border-purple-500 rounded-2xl text-stone-900 placeholder:text-stone-400 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
          />
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          {location && (
            <button
              onClick={() => setLocation('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 hover:bg-stone-300 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Preset location chips */}
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
            Gợi ý nhanh khu vực hot:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_LOCATIONS.map((loc, idx) => {
              const isActive = location === loc.query;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetLocation(loc.query)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs scale-102 font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <span>{loc.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. THANH CHỌN NGÂN SÁCH */}
      <div className="mb-6 pt-4 border-t border-purple-50">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-purple-600" />
            Mức ngân sách dự kiến (cho mỗi người)
          </label>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
            {selectedBudget}
          </span>
        </div>

        {/* Budget buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
          {BUDGET_OPTIONS.map((opt) => {
            const isSelected = selectedBudget === opt.label;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedBudget(opt.label)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 text-purple-950 shadow-xs ring-1 ring-purple-500'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-purple-50/50 text-stone-700'
                }`}
              >
                <span className="font-bold text-sm leading-tight">{opt.label}</span>
                <span className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                  {opt.subText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BỘ LỌC LOẠI MÓN ĂN */}
      <div className="mb-6 pt-4 border-t border-purple-50">
        <label className="text-sm font-bold text-stone-800 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Loại món ăn / Bữa ăn
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer group active:scale-95 text-center ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-bold shadow-xs ring-1 ring-purple-500'
                    : 'border-stone-200/80 bg-stone-50/50 hover:bg-purple-50/40 text-stone-700'
                }`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-xs font-semibold leading-tight line-clamp-1">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TIỆN ÍCH / PHONG CÁCH QUÁN (Expandable or visible) */}
      <div className="mb-6 pt-3 border-t border-purple-50">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span>Tiêu chí bổ sung ({selectedTags.length} đã chọn)</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showAdvanced ? 'rotate-180' : ''
              }`}
            />
          </button>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => selectedTags.forEach((t) => toggleTag(t))}
              className="text-[11px] text-stone-400 hover:text-stone-600 underline cursor-pointer"
            >
              Đặt lại
            </button>
          )}
        </div>

        {showAdvanced && (
          <div className="mt-3 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-wrap gap-1.5">
              {AMENITY_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white font-semibold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-purple-50/50'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>

            <div>
              <input
                type="text"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Ghi chú thêm (VD: Ăn cùng nhóm 6 người, thích vị cay nồng, ăn chay...)"
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. NÚT TÌM QUÁN NGON CHÍNH */}
      <button
        type="button"
        onClick={onSearch}
        disabled={isLoading || !location.trim()}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-purple-600/25 hover:shadow-purple-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>AI & Google Search đang tìm quán ngon nhất...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Tìm quán ngon & rẻ ngay</span>
          </>
        )}
      </button>
    </div>
  );
};
