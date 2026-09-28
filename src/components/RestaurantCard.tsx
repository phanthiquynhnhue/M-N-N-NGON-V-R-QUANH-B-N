import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Car,
  Bookmark,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Utensils,
  Sparkles,
  Wind
} from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isSaved: boolean;
  onToggleSave: (restaurant: Restaurant) => void;
  index: number;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSaved,
  onToggleSave,
  index
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(restaurant.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `${restaurant.name} - ${restaurant.address} | Quán ngon rẻ ${restaurant.priceRange}`;
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    restaurant.googleMapsQuery || `${restaurant.name} ${restaurant.address}`
  )}`;

  return (
    <div className="bg-white rounded-3xl border border-purple-100/90 hover:border-purple-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Banner / Badges */}
      <div className="p-5 sm:p-6 pb-0">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                <Utensils className="w-3 h-3 text-purple-600" />
                {restaurant.category || 'Món ngon'}
              </span>

              {restaurant.highlightBadge && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100/80 text-violet-900">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  {restaurant.highlightBadge}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 group-hover:text-purple-700 transition-colors">
              {index + 1}. {restaurant.name}
            </h3>
          </div>

          {/* Rating Pill */}
          <div className="flex flex-col items-end shrink-0">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-sm shadow-xs">
              <Star className="w-4 h-4 fill-white" />
              <span>{restaurant.rating}</span>
            </div>
            {restaurant.reviewCount && (
              <span className="text-[11px] text-stone-400 mt-0.5">
                {restaurant.reviewCount}
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-stone-600 text-xs sm:text-sm mb-3">
          <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <span className="flex-1 leading-snug">{restaurant.address}</span>
          <button
            onClick={handleCopyAddress}
            className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Sao chép địa chỉ"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Chép</span>
              </>
            )}
          </button>
        </div>

        {/* Price & Atmosphere tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold">
            💰 {restaurant.priceRange}
          </div>

          {restaurant.atmosphere && (
            <div className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
              <Wind className="w-3 h-3 text-stone-400" />
              {restaurant.atmosphere}
            </div>
          )}

          {restaurant.openingHours && (
            <div className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {restaurant.openingHours}
            </div>
          )}
        </div>

        {/* Signature Dishes */}
        {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
          <div className="mb-3.5">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Món ngon nên thử:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {restaurant.signatureDishes.map((dish, dIdx) => (
                <span
                  key={dIdx}
                  className="px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-950 text-xs font-semibold"
                >
                  🥢 {dish}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Why Recommended description */}
        <div className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-100/70 text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
          <span className="font-bold text-purple-950">Tại sao nên ăn: </span>
          {restaurant.whyRecommended}
        </div>

        {/* Parking tip if available */}
        {restaurant.parkingTip && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
            <Car className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{restaurant.parkingTip}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 bg-purple-50/20 border-t border-purple-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onToggleSave(restaurant)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isSaved
                ? 'bg-purple-100 border-purple-200 text-purple-700'
                : 'bg-white border-stone-200 text-stone-600 hover:text-purple-700 hover:border-purple-200'
            }`}
            title={isSaved ? 'Bỏ lưu quán này' : 'Lưu lại quán yêu thích'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600 text-purple-600' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu quán'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            title="Chia sẻ thông tin quán"
          >
            {shared ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{shared ? 'Đã chép' : 'Chia sẻ'}</span>
          </button>
        </div>

        {/* Maps Button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Mở Google Maps</span>
        </a>
      </div>
    </div>
  );
};
