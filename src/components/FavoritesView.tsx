import React, { useState } from 'react';
import { Heart, Trash2, MapPin, Navigation, Star, Utensils } from 'lucide-react';
import { Dish, Restaurant } from '../types';

interface FavoritesViewProps {
  favoriteDishes: Dish[];
  favoriteRestaurants: Restaurant[];
  onRemoveFavoriteDish: (id: string) => void;
  onClearAllFavorites: () => void;
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (res: Restaurant) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteDishes,
  favoriteRestaurants,
  onRemoveFavoriteDish,
  onClearAllFavorites,
  onSelectDish,
  onSelectRestaurant,
}) => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants'>('dishes');

  const totalCount = favoriteDishes.length + favoriteRestaurants.length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-orange-100 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💖</span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Món ăn & Quán ruột đã lưu ({totalCount})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Sổ tay lưu lại những món ngon và quán quen yêu thích để thưởng thức bất cứ lúc nào!
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={onClearAllFavorites}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-orange-100 pb-2">
        <button
          onClick={() => setActiveTab('dishes')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'dishes'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-orange-50'
          }`}
        >
          Món ăn yêu thích ({favoriteDishes.length})
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'restaurants'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white text-stone-600 hover:bg-orange-50'
          }`}
        >
          Quán ăn yêu thích ({favoriteRestaurants.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'dishes' ? (
        favoriteDishes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-orange-100 p-12 text-center">
            <span className="text-5xl block mb-2">🍜</span>
            <h4 className="font-bold text-stone-700 text-base">Chưa có món ăn nào được lưu</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Nhấn vào biểu tượng trái tim ở góc mỗi món ăn trên trang chủ hoặc trang ăn vặt để lưu lại nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteDishes.map((dish) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${dish.restaurantName} ${dish.restaurantAddress}`
              )}`;

              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl border border-orange-100 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-44 bg-stone-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => onRemoveFavoriteDish(dish.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-rose-500 hover:bg-rose-50 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-orange-600 text-white text-xs font-black shadow-xs">
                      {dish.priceFormatted}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-stone-400">{dish.categoryLabel}</span>
                        <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {dish.rating}
                        </span>
                      </div>
                      <h4
                        onClick={() => onSelectDish(dish)}
                        className="font-extrabold text-stone-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
                      >
                        {dish.name}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-stone-600 truncate max-w-[130px]">
                        {dish.restaurantName}
                      </span>
                      <div className="flex items-center gap-1.5">
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
                          onClick={() => onSelectDish(dish)}
                          className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer"
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
        )
      ) : (
        /* Restaurants list */
        favoriteRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl border border-orange-100 p-12 text-center">
            <span className="text-5xl block mb-2">🏪</span>
            <h4 className="font-bold text-stone-700 text-base">Chưa có quán ăn nào được lưu</h4>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Hãy bấm vào trang &quot;Tìm quán ăn&quot; để thêm các địa chỉ quen thuộc của bạn nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteRestaurants.map((res) => (
              <div
                key={res.id}
                onClick={() => onSelectRestaurant(res)}
                className="bg-white rounded-3xl border border-orange-100 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
              >
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-full h-36 rounded-2xl object-cover mb-2"
                />
                <h4 className="font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {res.name}
                </h4>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{res.address}</p>
                <div className="flex items-center justify-between text-xs font-bold mt-2">
                  <span className="text-emerald-700">{res.averagePrice}</span>
                  <span className="text-amber-500">★ {res.rating}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
