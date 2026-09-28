import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  UtensilsCrossed,
  Info,
  ExternalLink,
  ShieldCheck,
  Search,
  RotateCcw,
  Lightbulb,
  Heart,
  ChevronRight
} from 'lucide-react';
import { Header } from './components/Header';
import { SearchFilters } from './components/SearchFilters';
import { RestaurantCard } from './components/RestaurantCard';
import { RandomFoodModal } from './components/RandomFoodModal';
import { SavedDrawer } from './components/SavedDrawer';
import { Restaurant, SearchResult } from './types';
import { LOADING_FACTS } from './data/constants';

export default function App() {
  // State for search criteria
  const [location, setLocation] = useState<string>('Quận Bình Thạnh, TP.HCM');
  const [selectedBudget, setSelectedBudget] = useState<string>('Dưới 50k');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [extraNotes, setExtraNotes] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Results & UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingFactIndex, setLoadingFactIndex] = useState<number>(0);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Saved bookmarks in localStorage
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>(() => {
    try {
      const saved = localStorage.getItem('saved_restaurants');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saved_restaurants', JSON.stringify(savedRestaurants));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [savedRestaurants]);

  // Loading facts rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingFactIndex((prev) => (prev + 1) % LOADING_FACTS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Tag toggle helper
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Bookmark toggle
  const handleToggleSave = (restaurant: Restaurant) => {
    setSavedRestaurants((prev) => {
      const exists = prev.some((r) => r.id === restaurant.id);
      if (exists) {
        return prev.filter((r) => r.id !== restaurant.id);
      } else {
        return [restaurant, ...prev];
      }
    });
  };

  // Handle geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`
          );
          const data = await res.json();
          if (data && data.display_name) {
            // Simplify address name
            const addressParts = [
              data.address?.suburb,
              data.address?.quarter || data.address?.neighbourhood,
              data.address?.city_district || data.address?.district,
              data.address?.city || data.address?.state
            ].filter(Boolean);

            if (addressParts.length > 0) {
              setLocation(addressParts.join(', '));
            } else {
              setLocation(`Tọa độ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            setLocation(`Tọa độ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (err) {
          console.warn('Reverse geocode error:', err);
          setLocation(`Tọa độ: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        alert('Không thể lấy vị trí hiện tại. Vui lòng cấp quyền truy cập vị trí trên trình duyệt hoặc nhập tên khu vực.');
      },
      { timeout: 10000 }
    );
  };

  // Execute Search
  const handleSearch = async () => {
    if (!location.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/find-restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          budget: selectedBudget,
          category: selectedCategory,
          tags: selectedTags,
          extraNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Lỗi kết nối máy chủ: ${response.status}`);
      }

      const data: SearchResult = await response.json();
      setSearchResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Search failed:', err);
      setErrorMessage(
        err.message || 'Có lỗi xảy ra khi tìm kiếm quán ăn. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial auto search on first visit for Bình Thạnh
  useEffect(() => {
    handleSearch();
  }, []);

  // When selected a dish from roulette
  const handleSelectDishFromRoulette = (dishName: string) => {
    setSelectedCategory('Tất cả');
    setExtraNotes(`Tìm quán chuyên bán món: ${dishName}`);
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#faf8fc] flex flex-col text-stone-900 selection:bg-purple-600 selection:text-white">
      {/* Sticky Header */}
      <Header
        savedCount={savedRestaurants.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenRandomModal={() => setIsRandomModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold shadow-2xs border border-purple-200/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Gemini kết hợp Google Search Grounding thực tế</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Tìm quán <span className="text-purple-700 underline decoration-purple-300 decoration-wavy decoration-2">ngon & rẻ</span> quanh bạn
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Nhập khu vực, chọn mức ngân sách và loại món ăn bạn thèm. Hệ thống sẽ quét đánh giá thực tế và gợi ý các quán chất lượng nhất!
          </p>
        </div>

        {/* Search & Filter Component */}
        <SearchFilters
          location={location}
          setLocation={setLocation}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTags={selectedTags}
          toggleTag={handleToggleTag}
          extraNotes={extraNotes}
          setExtraNotes={setExtraNotes}
          onSearch={handleSearch}
          isLoading={isLoading}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
        />

        {/* Loading Overlay / Progress Card */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-purple-200 p-8 text-center shadow-lg shadow-purple-500/5 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 animate-bounce shadow-md shadow-purple-500/25">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Đang tìm kiếm quán ăn phù hợp...
            </h3>
            <p className="text-sm font-medium text-purple-700 transition-all duration-300 max-w-md mx-auto">
              {LOADING_FACTS[loadingFactIndex]}
            </p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={handleSearch}
              className="px-3 py-1 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Results Section */}
        {searchResult && !isLoading && (
          <div id="results-section" className="space-y-6 pt-4">
            {/* Header info & AI Analysis */}
            <div className="bg-gradient-to-r from-purple-600/10 via-violet-500/10 to-transparent border border-purple-200/80 rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-sm">
                    {searchResult.restaurants.length}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg leading-tight">
                      Quán ngon được đề xuất tại {location}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Ngân sách: <span className="font-semibold text-purple-900">{selectedBudget}</span> • Loại món: <span className="font-semibold text-purple-900">{selectedCategory}</span>
                    </p>
                  </div>
                </div>

                {/* Grounding badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dữ liệu xác thực từ Google Maps & Search</span>
                </div>
              </div>

              {/* Summary text */}
              {searchResult.summary && (
                <p className="text-sm text-stone-700 leading-relaxed font-medium bg-white/80 p-3.5 rounded-2xl border border-purple-100">
                  💡 {searchResult.summary}
                </p>
              )}

              {/* Sources citations if available */}
              {searchResult.groundingSources && searchResult.groundingSources.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-purple-100/70 text-xs text-stone-500">
                  <span className="font-semibold">Nguồn tham khảo:</span>
                  {searchResult.groundingSources.slice(0, 4).map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:border-purple-400 text-stone-600 hover:text-purple-700 transition-colors"
                    >
                      <span className="truncate max-w-[140px]">{source.title || 'Google Search'}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Restaurant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {searchResult.restaurants.map((restaurant, index) => {
                const isSaved = savedRestaurants.some((r) => r.id === restaurant.id);
                return (
                  <RestaurantCard
                    key={restaurant.id || index}
                    restaurant={restaurant}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                    index={index}
                  />
                );
              })}
            </div>

            {/* Local Foodie Tips */}
            {searchResult.localTips && searchResult.localTips.length > 0 && (
              <div className="bg-white rounded-3xl border border-purple-100/90 p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-base">
                    Mẹo ăn uống địa phương tại {location}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {searchResult.localTips.map((tip, tIdx) => (
                    <li key={tIdx} className="text-xs sm:text-sm text-stone-600 flex items-start gap-2">
                      <span className="text-purple-600 font-bold leading-none mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="p-6 bg-purple-50/50 border border-purple-100/60 rounded-3xl text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-2xl bg-white border border-stone-200 hover:border-purple-300 text-stone-800 font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-purple-600" />
                <span>Đổi tiêu chí tìm kiếm</span>
              </button>
              <button
                onClick={() => setIsRandomModalOpen(true)}
                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Quay chọn món ngẫu nhiên</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/60 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 Ăn Gì Đây? — Khám phá quán ngon, bổ, rẻ cùng Gemini AI & Google Search
          </p>
          <div className="flex items-center gap-3">
            <span>Dành cho học sinh, sinh viên & dân văn phòng</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <RandomFoodModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        onSelectDish={handleSelectDishFromRoulette}
      />

      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedRestaurants={savedRestaurants}
        onRemove={(id) => setSavedRestaurants((prev) => prev.filter((r) => r.id !== id))}
        onClearAll={() => setSavedRestaurants([])}
      />
    </div>
  );
}
