import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RestaurantListView } from './components/RestaurantListView';
import { SnackSpecialView } from './components/SnackSpecialView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { FavoritesView } from './components/FavoritesView';
import { QuickDishModal } from './components/QuickDishModal';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import {
  Dish,
  Restaurant,
  NavTab,
  DietaryFilterState,
  RestaurantReview,
} from './types';
import { INITIAL_DISHES, INITIAL_RESTAURANTS } from './data/mockData';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [budgetInput, setBudgetInput] = useState<string>('');

  // Datasets
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);

  // Dietary Filters
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilterState>({
    noSpicy: false,
    noMeat: false,
    vegetarian: false,
    noSeafood: false,
    lowFat: false,
    mealFull: false,
    mealLight: false,
    soupDish: false,
    dryDish: false,
  });

  // User GPS Location State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Modals State
  const [isQuickDishOpen, setIsQuickDishOpen] = useState<boolean>(false);
  const [quickDish, setQuickDish] = useState<Dish | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Favorites (Dishes & Restaurants) persisted in LocalStorage
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('homnayangi_fav_dishes');
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-4', 'dish-10'];
    } catch {
      return ['dish-1', 'dish-4'];
    }
  });

  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('homnayangi_fav_res');
      return saved ? JSON.parse(saved) : ['res-1', 'res-2'];
    } catch {
      return ['res-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('homnayangi_fav_dishes', JSON.stringify(favoriteDishIds));
    } catch (err) {
      console.warn('Failed to save dishes to localStorage:', err);
    }
  }, [favoriteDishIds]);

  useEffect(() => {
    try {
      localStorage.setItem('homnayangi_fav_res', JSON.stringify(favoriteRestaurantIds));
    } catch (err) {
      console.warn('Failed to save restaurants to localStorage:', err);
    }
  }, [favoriteRestaurantIds]);

  // Handle Location Request
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn chưa hỗ trợ định vị vị trí.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        // Recalculate rough distance to Saigon spots
        setRestaurants((prev) =>
          prev.map((r) => {
            const d = calculateDistance(latitude, longitude, r.coords.lat, r.coords.lng);
            return { ...r, distanceKm: parseFloat(d.toFixed(1)) };
          })
        );
      },
      (err) => {
        console.warn('Geolocation error or permission denied:', err);
        setIsLocating(false);
        // Fallback friendly alert
        alert(
          'Không thể lấy vị trí GPS hiện tại (do chưa cấp quyền hoặc đang ở chế độ riêng tư). Ứng dụng đã chuyển sang hiển thị các quán quanh khu vực trung tâm sinh viên TP.HCM!'
        );
      },
      { timeout: 8000 }
    );
  };

  // Distance helper (Haversine formula in KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Toggle Dietary
  const handleToggleDietary = (key: keyof DietaryFilterState) => {
    setDietaryFilter((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter Dishes by Query & Dietary
  const filteredDishes = dishes.filter((dish) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchCat = dish.categoryLabel.toLowerCase().includes(q);
      const matchRes = dish.restaurantName.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchRes && !matchDesc) return false;
    }

    // Dietary
    if (dietaryFilter.noSpicy && dish.dietary.isSpicy) return false;
    if (dietaryFilter.noMeat && !dish.dietary.isNoMeat) return false;
    if (dietaryFilter.vegetarian && !dish.dietary.isVegetarian) return false;
    if (dietaryFilter.noSeafood && !dish.dietary.isNoSeafood) return false;
    if (dietaryFilter.lowFat && !dish.dietary.isLowFat) return false;
    if (dietaryFilter.mealFull && dish.dietary.mealType !== 'no') return false;
    if (dietaryFilter.mealLight && dish.dietary.mealType !== 'nhe') return false;
    if (dietaryFilter.soupDish && dish.dietary.texture !== 'nuoc') return false;
    if (dietaryFilter.dryDish && dish.dietary.texture !== 'kho') return false;

    return true;
  });

  // Favorite toggles
  const handleToggleFavoriteDish = (dish: Dish) => {
    setFavoriteDishIds((prev) =>
      prev.includes(dish.id) ? prev.filter((id) => id !== dish.id) : [...prev, dish.id]
    );
  };

  const handleToggleFavoriteRestaurant = (res: Restaurant) => {
    setFavoriteRestaurantIds((prev) =>
      prev.includes(res.id) ? prev.filter((id) => id !== res.id) : [...prev, res.id]
    );
  };

  // Open Quick Random Dish Suggestion
  const handleOpenQuickDish = () => {
    const pool = filteredDishes.length > 0 ? filteredDishes : dishes;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setQuickDish(pool[randomIndex]);
    setIsQuickDishOpen(true);
  };

  // Quick Dish Refresh
  const handleRefreshQuickDish = () => {
    const pool = filteredDishes.length > 0 ? filteredDishes : dishes;
    const otherDishes = pool.filter((d) => d.id !== quickDish?.id);
    const candidateList = otherDishes.length > 0 ? otherDishes : pool;
    const randomIndex = Math.floor(Math.random() * candidateList.length);
    setQuickDish(candidateList[randomIndex]);
  };

  // Search by Budget
  const handleSearchBudget = (maxAmount: number) => {
    // Filter dishes under maxAmount
    setSearchQuery('');
    setDishes(INITIAL_DISHES.filter((d) => d.price <= maxAmount));
    // Scroll or view
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Add Review to Restaurant
  const handleAddReview = (
    restaurantId: string,
    newReview: Omit<RestaurantReview, 'id' | 'date'>
  ) => {
    const reviewWithMeta: RestaurantReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: 'Vừa xong',
    };

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === restaurantId) {
          const updatedReviews = [reviewWithMeta, ...r.reviews];
          // Recalculate average rating
          const avg =
            updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length;
          return {
            ...r,
            rating: parseFloat(avg.toFixed(1)),
            reviewCount: r.reviewCount + 1,
            reviews: updatedReviews,
          };
        }
        return r;
      })
    );

    // Also update selected restaurant modal state
    setSelectedRestaurant((prev) => {
      if (!prev || prev.id !== restaurantId) return prev;
      const updatedReviews = [reviewWithMeta, ...prev.reviews];
      const avg =
        updatedReviews.reduce((sum, item) => sum + item.rating, 0) / updatedReviews.length;
      return {
        ...prev,
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: prev.reviewCount + 1,
        reviews: updatedReviews,
      };
    });
  };

  // List of favorites objects
  const favoriteDishesList = dishes.filter((d) => favoriteDishIds.includes(d.id));
  const favoriteRestaurantsList = restaurants.filter((r) => favoriteRestaurantIds.includes(r.id));

  // Snacks dataset (special filter for items in an_vat or marked snack specialty)
  const snackDishesList = dishes.filter(
    (d) => d.category === 'an_vat' || d.category === 'do_uong' || d.isSnackSpecialty
  );

  return (
    <div className="min-h-screen bg-[#fff9f0] flex flex-col text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Cute Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        favoritesCount={favoriteDishIds.length + favoriteRestaurantIds.length}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Render Tab Views */}
        {currentTab === 'home' && (
          <HomeView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dishes={filteredDishes}
            featuredRestaurants={restaurants}
            onOpenQuickDish={handleOpenQuickDish}
            onOpenWheel={() => setIsWheelOpen(true)}
            onNavigateToTab={setCurrentTab}
            onSelectDish={(d) => {
              setQuickDish(d);
              setIsQuickDishOpen(true);
            }}
            onSelectRestaurant={(r) => setSelectedRestaurant(r)}
            onToggleFavoriteDish={handleToggleFavoriteDish}
            favoriteDishIds={favoriteDishIds}
            dietaryFilter={dietaryFilter}
            onToggleDietary={handleToggleDietary}
            budgetInput={budgetInput}
            setBudgetInput={setBudgetInput}
            onSearchBudget={handleSearchBudget}
          />
        )}

        {currentTab === 'restaurants' && (
          <RestaurantListView
            restaurants={restaurants}
            userLocation={userLocation}
            onRequestLocation={handleRequestLocation}
            isLocating={isLocating}
            onSelectRestaurant={(r) => setSelectedRestaurant(r)}
            onOpenMapToRestaurant={(r) => {
              setSelectedRestaurant(r);
              setCurrentTab('map');
            }}
          />
        )}

        {currentTab === 'snacks' && (
          <SnackSpecialView
            snackDishes={snackDishesList}
            onSelectDish={(d) => {
              setQuickDish(d);
              setIsQuickDishOpen(true);
            }}
            onToggleFavorite={handleToggleFavoriteDish}
            favoriteDishIds={favoriteDishIds}
          />
        )}

        {currentTab === 'map' && (
          <InteractiveMapView
            restaurants={restaurants}
            userLocation={userLocation}
            onRequestLocation={handleRequestLocation}
            isLocating={isLocating}
            selectedRestaurantId={selectedRestaurant?.id}
            onSelectRestaurant={(r) => setSelectedRestaurant(r)}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesView
            favoriteDishes={favoriteDishesList}
            favoriteRestaurants={favoriteRestaurantsList}
            onRemoveFavoriteDish={(id) =>
              setFavoriteDishIds((prev) => prev.filter((dId) => dId !== id))
            }
            onClearAllFavorites={() => {
              setFavoriteDishIds([]);
              setFavoriteRestaurantIds([]);
            }}
            onSelectDish={(d) => {
              setQuickDish(d);
              setIsQuickDishOpen(true);
            }}
            onSelectRestaurant={(r) => setSelectedRestaurant(r)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-orange-200/60 bg-white/80 py-8 text-center text-xs text-stone-500 mb-14 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <span className="font-extrabold text-stone-800 text-sm">HÔM NAY ĂN GÌ?</span>
            <span className="text-orange-600 font-semibold">• Ăn ngon mỗi ngày – Không lo về giá!</span>
          </div>
          <p className="text-stone-400">
            Dành riêng cho học sinh, sinh viên và giới trẻ Việt Nam • Dữ liệu quán ăn thực tế
          </p>
        </div>
      </footer>

      {/* Modals */}
      <QuickDishModal
        isOpen={isQuickDishOpen}
        onClose={() => setIsQuickDishOpen(false)}
        dish={quickDish}
        onRefresh={handleRefreshQuickDish}
        isSaved={quickDish ? favoriteDishIds.includes(quickDish.id) : false}
        onToggleFavorite={handleToggleFavoriteDish}
        onOpenRestaurantDetails={(resId) => {
          const found = restaurants.find((r) => r.id === resId);
          if (found) {
            setIsQuickDishOpen(false);
            setSelectedRestaurant(found);
          }
        }}
      />

      <LuckyWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        dishes={dishes}
        onSelectDish={(d) => {
          setQuickDish(d);
          setIsQuickDishOpen(true);
        }}
      />

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        isFavorite={selectedRestaurant ? favoriteRestaurantIds.includes(selectedRestaurant.id) : false}
        onToggleFavorite={handleToggleFavoriteRestaurant}
        onAddReview={handleAddReview}
      />
    </div>
  );
}
