import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Star, Search, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
import { Restaurant } from '../types';

interface InteractiveMapViewProps {
  restaurants: Restaurant[];
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
  isLocating: boolean;
  selectedRestaurantId?: string | null;
  onSelectRestaurant: (res: Restaurant) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  restaurants,
  userLocation,
  onRequestLocation,
  isLocating,
  selectedRestaurantId,
  onSelectRestaurant,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [activeRes, setActiveRes] = useState<Restaurant | null>(
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0] || null
  );
  const [districtSearch, setDistrictSearch] = useState<string>('');

  // Default center around Saigon university hub (Bình Thạnh / Thủ Đức)
  const defaultCenter = userLocation || { lat: 10.8105, lng: 106.7205 };

  useEffect(() => {
    // Dynamically load Leaflet if not yet available on window
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize OpenStreetMap tiles
      const map = L.map(mapContainerRef.current).setView(
        [defaultCenter.lat, defaultCenter.lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom cute food pin marker
      const foodIcon = L.divIcon({
        className: 'custom-food-pin',
        html: `
          <div style="background: #ff7e36; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(255, 126, 54, 0.4); font-size: 16px;">
            🍜
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      // User location marker if available
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'custom-user-pin',
          html: `
            <div style="background: #3b82f6; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.25);">
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Vị trí hiện tại của bạn</b>');
      }

      // Add pins for restaurants
      markersRef.current = [];
      restaurants.forEach((res) => {
        const marker = L.marker([res.coords.lat, res.coords.lng], { icon: foodIcon }).addTo(map);

        marker.on('click', () => {
          setActiveRes(res);
          map.panTo([res.coords.lat, res.coords.lng]);
        });

        markersRef.current.push(marker);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation]);

  // Center on active restaurant when changed
  const handleSelectRes = (res: Restaurant) => {
    setActiveRes(res);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([res.coords.lat, res.coords.lng], 15, {
        duration: 1.2,
      });
    }
  };

  const filteredRestaurants = districtSearch
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
          r.address.toLowerCase().includes(districtSearch.toLowerCase()) ||
          r.district.toLowerCase().includes(districtSearch.toLowerCase())
      )
    : restaurants;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Search bar */}
      <div className="bg-white rounded-3xl border border-orange-100 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h2 className="text-xl font-black text-stone-900">
              Bản đồ ẩm thực trực quan (OpenStreetMap & Leaflet)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Nhấn vào ghim quán ăn trên bản đồ để xem địa chỉ, giá cả và bấm mở Google Maps để dẫn đường.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick search district */}
          <div className="relative">
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="Tìm theo khu vực / tên quán..."
              className="pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* GPS Button */}
          <button
            onClick={onRequestLocation}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Đang định vị...' : 'Vị trí của tôi'}</span>
          </button>
        </div>
      </div>

      {/* Main Map + Sidebar Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-2 h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border-2 border-orange-200/90 shadow-sm relative">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Current Location Indicator */}
          {userLocation && (
            <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-md border border-stone-200 text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Đã xác định vị trí của bạn</span>
            </div>
          )}

          {/* Verified Data Badge */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-xl shadow-xs border border-orange-200 text-[10px] font-extrabold text-orange-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tọa độ thực tế TP.HCM</span>
          </div>
        </div>

        {/* Selected Restaurant Information Card */}
        <div className="lg:col-span-1 space-y-3">
          {activeRes ? (
            <div className="bg-white rounded-3xl border-2 border-orange-200 p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="relative h-40 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={activeRes.image}
                  alt={activeRes.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>{activeRes.rating}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-sm">
                  {activeRes.averagePrice}
                </div>
              </div>

              <div>
                <h3 className="font-black text-lg text-stone-900 leading-tight">
                  {activeRes.name}
                </h3>
                <p className="text-xs text-stone-600 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{activeRes.address}</span>
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mt-2">
                  <span>Khoảng cách: <b>{activeRes.distanceKm} km</b></span>
                  <span>•</span>
                  <span>Mở cửa: <b>{activeRes.openingHours}</b></span>
                </div>
              </div>

              {/* Signature items */}
              <div>
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block mb-1">
                  Món đặc sắc:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeRes.signatureDishes.map((dish, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-800 border border-orange-100 font-semibold"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Google Maps External Directions */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeRes.googleMapsQuery || `${activeRes.name} ${activeRes.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Mở Google Maps chỉ đường</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-orange-100 p-8 text-center text-stone-400">
              Chọn một ghim trên bản đồ để xem thông tin quán
            </div>
          )}

          {/* Quick List of Nearby Spots */}
          <div className="bg-white rounded-3xl border border-orange-100 p-4 shadow-xs">
            <span className="text-xs font-extrabold text-stone-700 block mb-2">
              Danh sách các quán trên bản đồ ({filteredRestaurants.length}):
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {filteredRestaurants.map((res) => (
                <button
                  key={res.id}
                  onClick={() => handleSelectRes(res)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeRes?.id === res.id
                      ? 'border-orange-500 bg-orange-50/80 font-bold'
                      : 'border-stone-100 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold truncate">{res.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">{res.address}</p>
                  </div>
                  <span className="text-xs text-orange-600 font-black shrink-0">
                    {res.distanceKm} km
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
