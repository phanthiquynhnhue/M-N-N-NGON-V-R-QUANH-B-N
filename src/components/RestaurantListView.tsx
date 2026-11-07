import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Navigation,
  Compass,
  SlidersHorizontal,
  Clock,
  Phone,
  ShieldCheck,
  Search,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantListViewProps {
  restaurants: Restaurant[];
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
  isLocating: boolean;
  onSelectRestaurant: (res: Restaurant) => void;
  onOpenMapToRestaurant?: (res: Restaurant) => void;
}

export const RestaurantListView: React.FC<RestaurantListViewProps> = ({
  restaurants,
  userLocation,
  onRequestLocation,
  isLocating,
  onSelectRestaurant,
  onOpenMapToRestaurant,
}) => {
  const [radiusFilter, setRadiusFilter] = useState<'all' | '1km' | '3km' | '5km'>('all');
  const [sortOption, setSortOption] = useState<'distance' | 'priceAsc' | 'ratingDesc'>('ratingDesc');
  const [searchDistrict, setSearchDistrict] = useState<string>('all');

  // Filter restaurants by radius & district
  let filtered = [...restaurants];

  if (radiusFilter === '1km') {
    filtered = filtered.filter((r) => (r.distanceKm || 99) <= 1.0);
  } else if (radiusFilter === '3km') {
    filtered = filtered.filter((r) => (r.distanceKm || 99) <= 3.0);
  } else if (radiusFilter === '5km') {
    filtered = filtered.filter((r) => (r.distanceKm || 99) <= 5.0);
  }

  if (searchDistrict !== 'all') {
    filtered = filtered.filter((r) => r.district.toLowerCase().includes(searchDistrict.toLowerCase()));
  }

  // Sort
  if (sortOption === 'priceAsc') {
    filtered.sort((a, b) => a.minPrice - b.minPrice);
  } else if (sortOption === 'ratingDesc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === 'distance') {
    filtered.sort((a, b) => (a.distanceKm || 99) - (b.distanceKm || 99));
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner / Location Permission Header */}
      <div className="bg-white rounded-3xl border border-orange-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Tìm quán ăn ngon gần đây
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Dữ liệu quán ăn thực tế có đánh giá cao từ học sinh, sinh viên và người dân địa phương.
          </p>
        </div>

        {/* GPS location action */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRequestLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating
                ? 'Đang lấy vị trí GPS...'
                : userLocation
                ? 'Đã lấy vị trí GPS ✓'
                : 'Cấp quyền vị trí'}
            </span>
          </button>
        </div>
      </div>

      {/* Controls & Filters: Radius, Sort, District */}
      <div className="bg-white rounded-3xl border border-orange-100 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
          <span>Bộ lọc & Sắp xếp quán:</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Radius Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-stone-500 mr-1">Bán kính:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: '1km', label: 'Trong 1km' },
              { id: '3km', label: 'Trong 3km' },
              { id: '5km', label: 'Trong 5km' },
            ].map((rf) => (
              <button
                key={rf.id}
                onClick={() => setRadiusFilter(rf.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  radiusFilter === rf.id
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-orange-50'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl bg-stone-100 text-stone-800 border-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="ratingDesc">Đánh giá cao đến thấp ⭐</option>
              <option value="priceAsc">Giá thấp đến cao 💰</option>
              <option value="distance">Khoảng cách gần nhất 📍</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of Restaurants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-orange-100 p-8">
            <span className="text-5xl block mb-2">🍜</span>
            <h4 className="font-bold text-stone-800 text-base">Không tìm thấy quán nào trong phạm vi này</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Hãy thử nới rộng bán kính lên 3km hoặc 5km để khám phá thêm nhiều quán ngon hấp dẫn nhé!
            </p>
            <button
              onClick={() => setRadiusFilter('all')}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Xem tất cả quán
            </button>
          </div>
        ) : (
          filtered.map((res) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              res.googleMapsQuery || `${res.name} ${res.address}`
            )}`;

            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-orange-100/90 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo & Top badges */}
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={res.image}
                    alt={res.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Verified spot badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-black text-emerald-700 flex items-center gap-1 shadow-sm border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dữ liệu thực tế xác thực</span>
                  </div>

                  {/* Distance */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-stone-900/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>{res.distanceKm ? `Cách ${res.distanceKm} km` : 'Gần bạn'}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{res.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectRestaurant(res)}
                      className="text-lg font-black text-stone-900 group-hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      {res.name}
                    </h3>

                    <p className="text-xs text-stone-600 mt-1 flex items-start gap-1.5 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{res.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        💰 {res.averagePrice}
                      </span>
                      <span className="font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {res.openingHours}
                      </span>
                    </div>

                    {/* Signature dishes */}
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                        Món ngon nổi tiếng:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {res.signatureDishes.map((dishName, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-xs px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-100"
                          >
                            🥢 {dishName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectRestaurant(res)}
                      className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Đánh giá ({res.reviewCount})</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {onOpenMapToRestaurant && (
                        <button
                          onClick={() => onOpenMapToRestaurant(res)}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Xem vị trí trên bản đồ"
                        >
                          <Compass className="w-3.5 h-3.5 text-orange-600" />
                          <span>Xem bản đồ</span>
                        </button>
                      )}

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Chỉ đường</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
