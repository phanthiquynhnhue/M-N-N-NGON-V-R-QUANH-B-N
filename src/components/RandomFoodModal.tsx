import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface FoodIdea {
  name: string;
  budget: string;
  mood: string;
  icon: string;
}

const FOOD_IDEAS: FoodIdea[] = [
  { name: 'Cơm Tấm Sườn Bì Chả', budget: '35k - 50k', mood: 'Bao no chắc dạ', icon: '🍛' },
  { name: 'Bún Đậu Mắm Tôm Mẹt', budget: '40k - 60k', mood: 'Tụ tập chém gió', icon: '🥢' },
  { name: 'Bún Bò Huế Chả Cua', budget: '35k - 55k', mood: 'Nóng hổi xì xụp', icon: '🍜' },
  { name: 'Bánh Mì Chảo Thập Cẩm', budget: '30k - 45k', mood: 'Bữa sáng nhanh gọn', icon: '🥖' },
  { name: 'Cơm Gà Xối Mỡ Da Giòn', budget: '35k - 50k', mood: 'Đậm vị giòn rụm', icon: '🍗' },
  { name: 'Hủ Tiếu Nam Vang / Mì Gõ', budget: '25k - 40k', mood: 'Ấm bụng bình dân', icon: '🍲' },
  { name: 'Lẩu Bò / Lẩu Thái Nhóm', budget: '90k - 150k/người', mood: 'Liên hoan cuối tuần', icon: '🥘' },
  { name: 'Bánh Tráng Trộn & Trà Đào', budget: '20k - 35k', mood: 'Ăn vặt giải lao', icon: '🧋' },
  { name: 'Phở Bò Tái Nạm Gầu', budget: '40k - 60k', mood: 'Thanh ngọt nước hầm', icon: '🍲' },
  { name: 'Mì Quảng Tôm Thịt Trứng', budget: '35k - 50k', mood: 'Đậm đà miền Trung', icon: '🍜' },
  { name: 'Gà Rán Giòn & Khoai Lắc', budget: '45k - 70k', mood: 'Đổi gió cuối tuần', icon: '🍟' },
  { name: 'Bò Né Bánh Mì Trứng', budget: '35k - 55k', mood: 'Tiếp năng lượng sáng', icon: '🍳' }
];

interface RandomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dishName: string) => void;
}

export const RandomFoodModal: React.FC<RandomFoodModalProps> = ({
  isOpen,
  onClose,
  onSelectDish
}) => {
  const [selectedDish, setSelectedDish] = useState<FoodIdea | null>(FOOD_IDEAS[0]);
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * FOOD_IDEAS.length);
      setSelectedDish(FOOD_IDEAS[randomIndex]);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
            <Sparkles className="w-6 h-6 animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900">
            Hôm nay ăn gì?
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Không biết chọn món gì? Hãy để bánh xe ẩm thực quyết định giúp bạn!
          </p>
        </div>

        {/* Selected Dish Card */}
        {selectedDish && (
          <div className="bg-gradient-to-b from-purple-50 via-violet-50/60 to-purple-50 border-2 border-purple-200 rounded-3xl p-6 text-center mb-6 shadow-inner">
            <div className={`text-6xl mb-3 transition-transform ${isSpinning ? 'scale-125 rotate-12' : 'scale-100'}`}>
              {selectedDish.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
              {selectedDish.name}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-white font-bold text-purple-700 shadow-xs border border-purple-100">
                💰 {selectedDish.budget}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 font-semibold text-purple-800">
                ✨ {selectedDish.mood}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm sm:text-base transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Đang chọn món...' : 'Quay món khác'}</span>
          </button>

          {selectedDish && (
            <button
              onClick={() => {
                onSelectDish(selectedDish.name);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Tìm quán bán món này quanh tôi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
