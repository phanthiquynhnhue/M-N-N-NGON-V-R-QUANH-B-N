import React from 'react';
import {
  Sparkles,
  UtensilsCrossed,
  Wallet,
  RotateCw,
  Compass,
  Heart,
  Star,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Dish, Restaurant, DietaryFilterState } from '../types';
import { CATEGORY_LIST, BUDGET_TIERS } from '../data/mockData';

interface HomeViewProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dishes: Dish[];
  featuredRestaurants: Restaurant[];
  onOpenQuickDish: () => void;
  onOpenWheel: () => void;
  onNavigateToTab: (tab: any) => void;
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (res: Restaurant) => void;
  onToggleFavoriteDish: (dish: Dish) => void;
  favoriteDishIds: string[];
  dietaryFilter: DietaryFilterState;
  onToggleDietary: (key: keyof DietaryFilterState) => void;
  budgetInput: string;
  setBudgetInput: (val: string) => void;
  onSearchBudget: (amount: number) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  searchQuery,
  setSearchQuery,
  dishes,
  featuredRestaurants,
  onOpenQuickDish,
  onOpenWheel,
  onNavigateToTab,
  onSelectDish,
  onSelectRestaurant,
  onToggleFavoriteDish,
  favoriteDishIds,
  dietaryFilter,
  onToggleDietary,
  budgetInput,
  setBudgetInput,
  onSearchBudget,
}) => {
  // Highlight of the day (top rated)
  const highlightDishes = dishes.slice(0, 4);

  const dietaryOptions: { key: keyof DietaryFilterState; label: string; icon: string }[] = [
    { key: 'noSpicy', label: 'Không ăn cay', icon: '🌶️❌' },
    { key: 'noMeat', label: 'Không ăn thịt', icon: '🥩❌' },
    { key: 'vegetarian', label: 'Ăn chay', icon: '🥑' },
    { key: 'noSeafood', label: 'Không hải sản', icon: '🦐❌' },
    { key: 'lowFat', label: 'Ít dầu mỡ', icon: '🥗' },
    { key: 'mealFull', label: 'Ăn no', icon: '🍚' },
    { key: 'mealLight', label: 'Ăn nhẹ', icon: '🥪' },
    { key: 'soupDish', label: 'Món nước', icon: '🍜' },
    { key: 'dryDish', label: 'Món khô', icon: '🥢' },
  ];

  const handleCustomBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseInt(budgetInput.replace(/\D/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum > 0) {
      onSearchBudget(cleanNum);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO SECTION & PROMINENT SEARCH */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100/90 via-orange-100/70 to-rose-100/80 p-6 sm:p-10 border border-orange-200/80 shadow-sm text-center">
        {/* Floating playful food badges */}
        <div className="absolute top-3 left-4 text-3xl animate-float opacity-80 pointer-events-none">
          🍲
        </div>
        <div className="absolute bottom-4 right-5 text-3xl animate-float opacity-80 pointer-events-none" style={{ animationDelay: '1.5s' }}>
          🧋
        </div>
        <div className="absolute top-5 right-10 text-2xl animate-float opacity-70 pointer-events-none" style={{ animationDelay: '0.8s' }}>
          🥖
        </div>

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-orange-700 text-xs font-bold shadow-2xs border border-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>Tiêu chí 4 chuẩn: GẦN – RẺ – NGON – CHẤT LƯỢNG</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            HÔM NAY ĂN GÌ?
          </h1>

          <p className="text-base sm:text-lg font-bold text-orange-800/90">
            &quot;Bạn chọn ngân sách – Chúng tôi chọn món ngon!&quot;
          </p>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Khám phá hàng trăm món ngon chuẩn vị sinh viên quanh các trường đại học và khu dân cư với mức giá cực kỳ phải chăng.
          </p>

          {/* Search Box */}
          <div className="pt-2">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bạn đang thèm món gì? (VD: Cơm sườn, bún bò, bánh tráng...)"
                className="w-full pl-11 pr-24 py-3.5 bg-white border-2 border-orange-200 focus:border-orange-500 rounded-2xl text-stone-900 placeholder:text-stone-400 font-semibold text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-md transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. BỐN NÚT CHỨC NĂNG CHÍNH THEO YÊU CẦU */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6">
          {/* Nút 1: Gợi ý món ăn ngay */}
          <button
            onClick={onOpenQuickDish}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-200/90 hover:border-orange-400 text-stone-800 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-95 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 group-hover:bg-orange-200 text-orange-600 flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110">
              💡
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-stone-900">
              Gợi ý món ăn ngay
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">Chọn ngẫu nhiên 1 món</span>
          </button>

          {/* Nút 2: Tìm quán gần tôi */}
          <button
            onClick={() => onNavigateToTab('restaurants')}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-200/90 hover:border-amber-400 text-stone-800 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-95 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 group-hover:bg-amber-200 text-amber-600 flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110">
              📍
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-stone-900">
              Tìm quán gần tôi
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">Lọc theo bán kính GPS</span>
          </button>

          {/* Nút 3: Ăn gì với ngân sách */}
          <button
            onClick={() => {
              const el = document.getElementById('budget-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-200/90 hover:border-emerald-400 text-stone-800 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-95 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-600 flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110">
              💰
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-stone-900">
              Ăn gì với ngân sách?
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">Túi tiền sinh viên</span>
          </button>

          {/* Nút 4: Vòng quay may mắn */}
          <button
            onClick={onOpenWheel}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg transition-all group cursor-pointer active:scale-95 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl mb-2 transition-transform group-hover:rotate-45">
              🎡
            </div>
            <span className="font-black text-xs sm:text-sm">Vòng quay may mắn</span>
            <span className="text-[11px] text-orange-100 mt-0.5 font-medium">Bấm quay chọn món</span>
          </button>
        </div>
      </section>

      {/* 3. BỘ LỌC YÊU CẦU ĂN UỐNG RIÊNG (Dietary Requirements) */}
      <section className="bg-white rounded-3xl border border-orange-100 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥑</span>
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
              Yêu cầu ăn uống riêng của bạn
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">Chọn để tự động lọc món</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((opt) => {
            const isSelected = dietaryFilter[opt.key];
            return (
              <button
                key={opt.key}
                onClick={() => onToggleDietary(opt.key)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-orange-50 hover:text-orange-700'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
                {isSelected && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. CHỌN MÓN THEO NGÂN SÁCH & TÍNH NĂNG "TÚI TIỀN SINH VIÊN" */}
      <section id="budget-section" className="bg-white rounded-3xl border border-orange-100 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👛</span>
              <h3 className="font-black text-lg sm:text-xl text-stone-900">
                TÚI TIỀN SINH VIÊN – CHỌN MÓN THEO NGÂN SÁCH
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Nhập số tiền bạn đang có trong ví, hệ thống sẽ gợi ý ngay các bữa ăn ngon no nê!
            </p>
          </div>
        </div>

        {/* Custom Money Input */}
        <form onSubmit={handleCustomBudgetSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="Nhập số tiền bạn có (VD: 25.000, 35000, 50k...)"
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 focus:border-orange-500 rounded-2xl text-stone-900 placeholder:text-stone-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">💵</span>
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm cursor-pointer shadow-xs transition-colors shrink-0"
          >
            Tìm món vừa túi tiền
          </button>
        </form>

        {/* Preset Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BUDGET_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => onSearchBudget(tier.max)}
              className="p-3 rounded-2xl border border-orange-100 bg-orange-50/50 hover:bg-orange-100 text-left transition-all cursor-pointer group active:scale-95"
            >
              <span className="font-black text-sm text-orange-900 block group-hover:text-orange-600">
                {tier.label}
              </span>
              <span className="text-[11px] text-stone-500 mt-0.5 line-clamp-1 block">
                {tier.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. DANH MỤC MÓN ĂN ĐA DẠNG */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <h3 className="font-extrabold text-base sm:text-lg text-stone-900">
              Danh mục món ăn phổ biến
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('restaurants')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'an_vat') {
                  onNavigateToTab('snacks');
                } else {
                  setSearchQuery(cat.label);
                }
              }}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200/80 hover:border-orange-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95 text-center"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-[11px] font-bold text-stone-800 leading-tight line-clamp-1">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. ĐỀ XUẤT MÓN ĂN NỔI BẬT TRONG NGÀY */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 leading-tight">
                Món ăn nổi bật trong ngày
              </h3>
              <span className="text-xs text-stone-500">Được sinh viên & người trẻ gọi nhiều nhất</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {highlightDishes.map((dish) => {
            const isFav = favoriteDishIds.includes(dish.id);
            return (
              <div
                key={dish.id}
                className="bg-white rounded-3xl border border-orange-100/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Image & Favorite toggle */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-extrabold text-orange-700 border border-orange-200 shadow-xs">
                      {dish.categoryLabel}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleFavoriteDish(dish)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-rose-500 shadow-xs cursor-pointer transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-xl bg-orange-600 text-white text-xs font-black shadow-xs">
                      {dish.priceFormatted}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        {dish.distanceKm ? `${dish.distanceKm}km` : 'Gần bạn'}
                      </span>
                      <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {dish.rating}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1 mb-1">
                      {dish.name}
                    </h4>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-600 truncate max-w-[140px]">
                      Quán: {dish.restaurantName}
                    </span>
                    <button
                      onClick={() => onSelectDish(dish)}
                      className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CÁC QUÁN ĂN ĐƯỢC YÊU THÍCH */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-stone-900 leading-tight">
                Quán ăn được sinh viên yêu thích
              </h3>
              <span className="text-xs text-stone-500">Đánh giá thực tế từ 4.5 sao trở lên</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('restaurants')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            Khám phá quán <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredRestaurants.slice(0, 3).map((res) => (
            <div
              key={res.id}
              onClick={() => onSelectRestaurant(res)}
              className="bg-white rounded-3xl border border-orange-100 p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-orange-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{res.rating} ({res.reviewCount})</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {res.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 line-clamp-1">
                    <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                    {res.address}
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    {res.averagePrice}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100">
                {res.tags.slice(0, 2).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
