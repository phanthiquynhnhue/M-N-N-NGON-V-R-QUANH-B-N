import React, { useState } from 'react';
import {
  Cookie,
  Star,
  MapPin,
  Heart,
  SlidersHorizontal,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { Dish } from '../types';

interface SnackSpecialViewProps {
  snackDishes: Dish[];
  onSelectDish: (dish: Dish) => void;
  onToggleFavorite: (dish: Dish) => void;
  favoriteDishIds: string[];
}

export const SnackSpecialView: React.FC<SnackSpecialViewProps> = ({
  snackDishes,
  onSelectDish,
  onToggleFavorite,
  favoriteDishIds,
}) => {
  const [selectedSnackCategory, setSelectedSnackCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortOption, setSortOption] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  const snackCategories = [
    { id: 'all', label: 'Tất cả ăn vặt', icon: '✨' },
    { id: 'banh_trang', label: 'Bánh tráng trộn / nướng', icon: '🌯' },
    { id: 'ca_vien', label: 'Cá viên chiên / Xiên que', icon: '🍢' },
    { id: 'tra_sua', label: 'Trà sữa / Đồ uống', icon: '🧋' },
    { id: 'ga_ran', label: 'Gà rán / Khoai lắc', icon: '🍗' },
    { id: 'tokbokki', label: 'Tokbokki phô mai', icon: '🧀' },
    { id: 'che', label: 'Chè & Đồ ngọt', icon: '🍧' },
  ];

  // Filtering
  let filtered = snackDishes.filter((dish) => dish.price <= maxPrice);

  if (selectedSnackCategory !== 'all') {
    filtered = filtered.filter((d) => {
      const name = d.name.toLowerCase();
      if (selectedSnackCategory === 'banh_trang') return name.includes('bánh tráng');
      if (selectedSnackCategory === 'ca_vien') return name.includes('cá viên') || name.includes('xiên');
      if (selectedSnackCategory === 'tra_sua') return name.includes('trà') || d.category === 'do_uong';
      if (selectedSnackCategory === 'ga_ran') return name.includes('gà rán') || name.includes('khoai tây');
      if (selectedSnackCategory === 'tokbokki') return name.includes('tokbokki');
      if (selectedSnackCategory === 'che') return name.includes('chè');
      return true;
    });
  }

  // Sorting
  if (sortOption === 'priceAsc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'priceDesc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-pink-100/90 via-orange-100/80 to-amber-100/80 rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-xs">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-orange-700 text-xs font-bold mb-2 shadow-2xs border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>THIÊN ĐƯỜNG ĂN VẶT HỌC SINH - SINH VIÊN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Món ăn vặt thơm ngon, giá hạt dẻ!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Bánh tráng trộn, cá viên chiên mắm, trà sữa nướng, gà lắc phô mai, tokbokki, xiên que và chè ngọt mát lạnh.
          </p>
        </div>
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {snackCategories.map((c) => {
          const isSelected = selectedSnackCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedSnackCategory(c.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-xs font-extrabold scale-102'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Budget & Sorting Controls */}
      <div className="bg-white rounded-3xl border border-orange-100 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Price Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-600">Ngân sách ăn vặt:</span>
          <div className="flex items-center gap-2">
            {[20000, 30000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setMaxPrice(amount)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  maxPrice === amount
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                ≤ {amount.toLocaleString('vi-VN')}đ
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">Sắp xếp:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="text-xs font-bold py-1.5 px-3 rounded-xl bg-stone-100 text-stone-800 border-none cursor-pointer"
          >
            <option value="rating">Đánh giá ngon nhất ⭐</option>
            <option value="priceAsc">Giá rẻ nhất 💰</option>
            <option value="priceDesc">Giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Snack Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((snack) => {
          const isFav = favoriteDishIds.includes(snack.id);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${snack.restaurantName} ${snack.restaurantAddress}`
          )}`;

          return (
            <div
              key={snack.id}
              className="bg-white rounded-3xl border border-orange-100 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => onToggleFavorite(snack)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-rose-500 shadow-xs cursor-pointer transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-orange-600 text-white text-xs font-black shadow-xs">
                  {snack.priceFormatted}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      {snack.distanceKm ? `${snack.distanceKm}km` : '1km'}
                    </span>
                    <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {snack.rating}
                    </span>
                  </div>

                  <h4
                    onClick={() => onSelectDish(snack)}
                    className="font-extrabold text-stone-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
                  >
                    {snack.name}
                  </h4>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {snack.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-[11px] font-medium text-stone-600 truncate max-w-[120px]">
                    {snack.restaurantName}
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                      title="Chỉ đường Google Maps"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onSelectDish(snack)}
                      className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                    >
                      Xem
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
