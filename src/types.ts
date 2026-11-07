export interface RestaurantReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Dish {
  id: string;
  name: string;
  category: 'com' | 'bun_pho_mi' | 'an_nhanh' | 'an_vat' | 'do_uong' | 'healthy' | 'chay';
  categoryLabel: string;
  price: number;
  priceFormatted: string;
  description: string;
  image: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  rating: number;
  reviewCount: number;
  distanceKm?: number;
  tags: string[]; // e.g. ['Ăn no', 'Món khô', 'Không cay']
  dietary: {
    isVegetarian?: boolean; // Ăn chay
    isNoMeat?: boolean; // Không ăn thịt
    isSpicy?: boolean; // Có cay hay không
    isNoSeafood?: boolean; // Không hải sản
    isLowFat?: boolean; // Ít dầu mỡ
    mealType?: 'no' | 'nhe'; // Ăn no hoặc Ăn nhẹ
    texture?: 'nuoc' | 'kho'; // Món nước hoặc Món khô
  };
  highlightBadge?: string;
  isSnackSpecialty?: boolean; // For trang Ăn Vặt chuyên sâu
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  address: string;
  district: string;
  averagePrice: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  reviewCount: number;
  openingHours: string;
  coords: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  phone?: string;
  tags: string[];
  signatureDishes: string[];
  reviews: RestaurantReview[];
  googleMapsQuery: string;
  isVerifiedReal: boolean; // Flag to indicate whether this is a real checked spot vs illustration
}

export interface DietaryFilterState {
  noSpicy: boolean; // Không ăn cay
  noMeat: boolean; // Không ăn thịt
  vegetarian: boolean; // Ăn chay
  noSeafood: boolean; // Không ăn hải sản
  lowFat: boolean; // Ít dầu mỡ
  mealFull: boolean; // Ăn no
  mealLight: boolean; // Ăn nhẹ
  soupDish: boolean; // Món nước
  dryDish: boolean; // Món khô
}

export type NavTab = 'home' | 'restaurants' | 'snacks' | 'map' | 'favorites';

export interface GroundingSource {
  title?: string;
  url?: string;
}
