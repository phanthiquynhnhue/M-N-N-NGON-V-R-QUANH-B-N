export interface Restaurant {
  id: string;
  name: string;
  address: string;
  district?: string;
  priceRange: string;
  rating: number;
  reviewCount?: string;
  category: string;
  signatureDishes: string[];
  whyRecommended: string;
  highlightBadge?: string;
  openingHours?: string;
  parkingTip?: string;
  atmosphere?: string;
  googleMapsQuery: string;
}

export interface GroundingSource {
  title?: string;
  url?: string;
}

export interface SearchResult {
  summary: string;
  restaurants: Restaurant[];
  localTips: string[];
  groundingSources?: GroundingSource[];
  searchQueries?: string[];
  notice?: string;
}

export interface FoodCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface BudgetOption {
  id: string;
  label: string;
  subText: string;
  min: number;
  max: number;
}
