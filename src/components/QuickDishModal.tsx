import React from 'react';
import { X, RotateCw, ExternalLink, MapPin, Star, Heart, Navigation, Info } from 'lucide-react';
import { Dish, Restaurant } from '../types';

interface QuickDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onRefresh: () => void;
  isSaved: boolean;
  onToggleFavorite: (dish: Dish) => void;
  onOpenRestaurantDetails?: (restaurantId: string) => void;
}

export const QuickDishModal: React.FC<QuickDishModalProps> = ({
  isOpen,
  onClose,
  dish,
  onRefresh,
  isSaved,
  onToggleFavorite,
  onOpenRestaurantDetails,
}) => {
  if (!isOpen || !dish) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${dish.restaurantName} ${dish.restaurantAddress}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-orange-200 relative flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Image & Floating Badges */}
        <div className="relative h-56 w-full bg-stone-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-500 hover:text-stone-900 flex items-center justify-center cursor-pointer shadow-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-black text-orange-700 shadow-md border border-orange-200">
            ✨ {dish.categoryLabel}
          </span>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-2xl bg-orange-600 text-white font-black text-sm shadow-md">
            💰 {dish.priceFormatted}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-xl font-black text-stone-900 leading-tight">
                {dish.name}
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm shrink-0">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{dish.rating}</span>
                <span className="text-[11px] text-stone-400">({dish.reviewCount})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {dish.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-orange-50 text-orange-800 text-xs font-semibold border border-orange-200/60"
              >
                🏷️ {t}
              </span>
            ))}
            {dish.highlightBadge && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/60">
                ⭐ {dish.highlightBadge}
              </span>
            )}
          </div>

          {/* Restaurant Card Info */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block">
                  Quán bán món này:
                </span>
                <h4 className="font-extrabold text-sm text-stone-900">
                  {dish.restaurantName}
                </h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700">
                Cách {dish.distanceKm ? `${dish.distanceKm}km` : '1km'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="line-clamp-1">{dish.restaurantAddress}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              {/* Chỉ đường */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Chỉ đường trên Google Maps</span>
              </a>

              {/* Bookmark */}
              <button
                onClick={() => onToggleFavorite(dish)}
                className={`px-4 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-rose-600'
                }`}
                title={isSaved ? 'Đã yêu thích' : 'Lưu món yêu thích'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Đổi món khác */}
            <button
              onClick={onRefresh}
              className="w-full py-2.5 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-extrabold text-xs sm:text-sm border border-orange-200 flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
            >
              <RotateCw className="w-4 h-4 text-orange-600" />
              <span>Đổi món khác ngẫu nhiên</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
