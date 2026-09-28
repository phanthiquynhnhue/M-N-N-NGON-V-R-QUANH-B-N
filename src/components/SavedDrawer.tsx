import React from 'react';
import { X, Bookmark, ExternalLink, Trash2, MapPin, Utensils } from 'lucide-react';
import { Restaurant } from '../types';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedRestaurants: Restaurant[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedRestaurants,
  onRemove,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-purple-600" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight">
                Quán đã lưu ({savedRestaurants.length})
              </h2>
              <span className="text-xs text-stone-400">
                Sổ tay ẩm thực ngon rẻ của bạn
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedRestaurants.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-300 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-700 text-base mb-1">
                Chưa có quán nào được lưu
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Bấm vào biểu tượng &quot;Lưu quán&quot; ở mỗi thẻ nhà hàng để lưu lại danh sách quán ruột cho những lần đi ăn sau!
              </p>
            </div>
          ) : (
            savedRestaurants.map((restaurant) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                restaurant.googleMapsQuery || `${restaurant.name} ${restaurant.address}`
              )}`;

              return (
                <div
                  key={restaurant.id}
                  className="p-4 rounded-2xl border border-purple-100 bg-stone-50/60 hover:bg-white transition-all shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                        {restaurant.category}
                      </span>
                      <h4 className="font-extrabold text-stone-900 text-sm group-hover:text-purple-700 transition-colors">
                        {restaurant.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                        title="Mở Google Maps"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemove(restaurant.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa khỏi danh sách"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                      {restaurant.priceRange}
                    </span>
                    <span className="font-bold text-amber-600">
                      ★ {restaurant.rating}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {savedRestaurants.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Xóa tất cả
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
