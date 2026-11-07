import React from 'react';
import { Utensils, Home, Compass, Cookie, Map, Heart, Sparkles } from 'lucide-react';
import { NavTab } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { id: 'restaurants', label: 'Tìm quán ăn', icon: <Compass className="w-5 h-5" /> },
    { id: 'snacks', label: 'Món ăn vặt', icon: <Cookie className="w-5 h-5" /> },
    { id: 'map', label: 'Bản đồ', icon: <Map className="w-5 h-5" /> },
    {
      id: 'favorites',
      label: 'Yêu thích',
      icon: <Heart className="w-5 h-5" />,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
  ];

  return (
    <>
      {/* Top Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo with Cute Plate & Utensils */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="relative">
              {/* Cute Food Plate Logo */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#fff9f0] rounded-full flex items-center justify-center border border-white">
                  <div className="relative flex items-center justify-center text-orange-500">
                    <span className="text-xl">🍲</span>
                  </div>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] text-white shadow-xs">
                ✨
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
                  HÔM NAY ĂN GÌ?
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  <Sparkles className="w-2.5 h-2.5 text-orange-500" />
                  Gần • Rẻ • Ngon
                </span>
              </div>
              <p className="text-[11px] font-medium text-stone-500 hidden sm:block">
                Ăn ngon mỗi ngày – Không lo về giá!
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-orange-50/70 p-1.5 rounded-2xl border border-orange-100">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-sm shadow-orange-500/10 scale-102 font-extrabold'
                      : 'text-stone-600 hover:text-orange-600 hover:bg-white/60'
                  }`}
                >
                  <span className={isActive ? 'text-orange-500' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Slogan Badge for Mobile/Tablet */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => onSelectTab('favorites')}
              className="relative p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-orange-500/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed for responsive phone usage) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-lg px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-orange-600 font-extrabold scale-105'
                  : 'text-stone-500 hover:text-orange-500 font-medium'
              }`}
            >
              <div className="relative">
                <span className={isActive ? 'text-orange-500' : 'text-stone-400'}>
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-extrabold bg-rose-500 text-white flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
