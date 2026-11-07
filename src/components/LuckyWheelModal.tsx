import React, { useRef, useState } from 'react';
import { X, Sparkles, RotateCw, ExternalLink, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Dish } from '../types';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  onSelectDish: (dish: Dish) => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onSelectDish,
}) => {
  // Use up to 8 colorful slices for balanced wheel
  const wheelDishes = dishes.slice(0, 8);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<Dish | null>(null);

  if (!isOpen) return null;

  const segmentAngle = 360 / wheelDishes.length;

  const colors = [
    '#ff7e36', // Bright orange
    '#f59e0b', // Amber
    '#fb923c', // Pastel orange
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];

  const handleSpin = () => {
    if (isSpinning || wheelDishes.length === 0) return;

    setIsSpinning(true);
    setSelectedWinner(null);

    // Random winner index
    const winnerIndex = Math.floor(Math.random() * wheelDishes.length);

    // Number of full spins (5-8 spins) + offset to align top pointer
    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    // Calculate final angle so pointer at top points to winner
    // Pointer is at 270 deg (top). Segment center is at (index * segmentAngle + segmentAngle / 2)
    const targetAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = rotation + extraSpins + (targetAngle - (rotation % 360));

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = wheelDishes[winnerIndex];
      setSelectedWinner(winner);

      // Fire festive colorful confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff7e36', '#f59e0b', '#fbbf24', '#f43f5e', '#fff'],
      });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-200 relative overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 bg-orange-50 hover:bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
            <span>VÒNG QUAY MAY MẮN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Hôm nay số phận chọn món gì?
          </h2>
          <p className="text-xs text-stone-500">
            Khỏi cần đau đầu suy nghĩ, bấm &quot;QUAY NGAY&quot; để vòng quay chọn giúp bạn!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Top Indicator Arrow / Marker */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-rose-600 drop-shadow-md" />

          {/* Canvas SVG Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-300 shadow-xl overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {wheelDishes.map((dish, idx) => {
                const startAngle = idx * segmentAngle;
                const endAngle = (idx + 1) * segmentAngle;

                // SVG Arc Path coordinates
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const textAngle = startAngle + segmentAngle / 2;
                const textX = 50 + 32 * Math.cos((Math.PI * textAngle) / 180);
                const textY = 50 + 32 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={dish.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={colors[idx % colors.length]}
                      stroke="#fff"
                      strokeWidth="0.8"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="3.4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                    >
                      {dish.name.length > 13 ? dish.name.slice(0, 12) + '...' : dish.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 text-white font-black text-xs shadow-lg flex flex-col items-center justify-center border-4 border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform disabled:opacity-80"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Đang quay' : 'QUAY!'}</span>
          </button>
        </div>

        {/* Selected Winner Card */}
        {selectedWinner && !isSpinning && (
          <div className="w-full mt-3 p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-200 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <img
              src={selectedWinner.image}
              alt={selectedWinner.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-orange-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                🎉 Món ngon trúng giải:
              </span>
              <h4 className="font-black text-sm text-stone-900 truncate mt-0.5">
                {selectedWinner.name}
              </h4>
              <p className="text-xs text-orange-600 font-extrabold">
                {selectedWinner.priceFormatted} •{' '}
                <span className="text-stone-500 font-medium">{selectedWinner.restaurantName}</span>
              </p>
            </div>
            <button
              onClick={() => {
                onSelectDish(selectedWinner);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Xem ngay
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="w-full flex items-center gap-2 mt-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSpinning ? 'Đang quay may mắn...' : 'QUAY NGAY'}</span>
          </button>
          {selectedWinner && (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="py-3 px-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 cursor-pointer"
            >
              Quay lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
