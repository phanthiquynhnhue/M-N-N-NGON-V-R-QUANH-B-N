import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Phone, Navigation, ShieldCheck, Heart, Send } from 'lucide-react';
import { Restaurant, RestaurantReview } from '../types';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (res: Restaurant) => void;
  onAddReview: (restaurantId: string, review: Omit<RestaurantReview, 'id' | 'date'>) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddReview,
}) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!restaurant) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    onAddReview(restaurant.id, {
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      verified: true,
    });

    setComment('');
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    restaurant.googleMapsQuery || `${restaurant.name} ${restaurant.address}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-200 relative flex flex-col animate-in zoom-in-95 duration-200">
        {/* Top Cover Image */}
        <div className="relative h-60 w-full bg-stone-100 shrink-0">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 text-stone-600 hover:text-stone-900 flex items-center justify-center cursor-pointer shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Rating */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-2xl bg-amber-500 text-white font-extrabold text-sm flex items-center gap-1.5 shadow-md">
            <Star className="w-4 h-4 fill-white" />
            <span>{restaurant.rating}</span>
            <span className="text-xs text-amber-100">({restaurant.reviewCount} đánh giá)</span>
          </div>

          <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-2xl bg-orange-600 text-white font-black text-sm shadow-md">
            {restaurant.averagePrice}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Header Title & Favorite Toggle */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Dữ liệu thực tế xác thực
                </span>
                <span className="text-xs text-stone-500 font-bold">
                  Cách bạn {restaurant.distanceKm} km
                </span>
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                {restaurant.name}
              </h3>
            </div>

            <button
              onClick={() => onToggleFavorite(restaurant)}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Contact & Hours */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2 text-xs sm:text-sm text-stone-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span><b>Địa chỉ:</b> {restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span><b>Giờ mở cửa:</b> {restaurant.openingHours}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span><b>Điện thoại:</b> {restaurant.phone}</span>
              </div>
            )}
          </div>

          {/* Signature Dishes */}
          <div>
            <h4 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider mb-2">
              🥢 Món ăn nổi bật tại quán:
            </h4>
            <div className="flex flex-wrap gap-2">
              {restaurant.signatureDishes.map((dishName, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-orange-100/80 text-orange-900 font-bold text-xs border border-orange-200"
                >
                  {dishName}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {restaurant.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold"
              >
                🏷️ {tag}
              </span>
            ))}
          </div>

          {/* Reviews List & Quality Rating */}
          <div className="border-t border-stone-100 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-base text-stone-900">
                ⭐ Đánh giá từ khách hàng thực tế ({restaurant.reviews.length})
              </h4>
            </div>

            <div className="space-y-3">
              {restaurant.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-stone-900">
                      {rev.userName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <span>★ {rev.rating}</span>
                      <span className="text-stone-400 font-normal ml-1">{rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-3">
              <h5 className="font-bold text-xs text-orange-900">
                Viết đánh giá & chia sẻ trải nghiệm của bạn:
              </h5>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tên của bạn (VD: Sinh viên FTU...)"
                  className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                  required
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-amber-600 focus:outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                  <option value={3}>⭐⭐⭐ (3 sao)</option>
                  <option value={2}>⭐⭐ (2 sao)</option>
                  <option value={1}>⭐ (1 sao)</option>
                </select>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhận xét về chất lượng đồ ăn, khẩu phần, thái độ phục vụ..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                required
              />

              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi đánh giá</span>
              </button>
            </form>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Chỉ đường trên Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
