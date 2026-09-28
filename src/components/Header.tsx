import React from 'react';
import { UtensilsCrossed, Bookmark, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenRandomModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSaved,
  onOpenRandomModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-purple-950 tracking-tight leading-none">
                Ăn Gì Đây?
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                <Sparkles className="w-3 h-3 text-purple-600" />
                AI & Google Search
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Tìm quán ngon, bổ, rẻ quanh trường học & văn phòng
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Wheel / Random Picker */}
          <button
            onClick={onOpenRandomModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Quay ngẫu nhiên hôm nay ăn gì"
          >
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="hidden sm:inline">Hôm nay ăn gì?</span>
            <span className="sm:hidden">Quay</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 bg-purple-50/60 hover:bg-purple-100/80 transition-all cursor-pointer active:scale-95 border border-purple-100"
            title="Danh sách quán đã lưu"
          >
            <Bookmark className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Đã lưu</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold rounded-full bg-purple-600 text-white leading-none">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
