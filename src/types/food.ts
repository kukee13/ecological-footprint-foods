export type EcoScore = 'GOOD' | 'MEDIUM' | 'BAD';
export type FoodCategory = 'Meat' | 'Vegetarian' | 'Vegan';

export interface FoodItem {
  id: string;
  nameDE: string;
  nameEN: string;
  category: FoodCategory;
  co2: number;
  water: number;
  ecoScore: EcoScore;
  reasoningDE: string;
  reasoningEN: string;
  emoji: string;
  pricePerKg: number;
  inSeasonMonths?: number[]; // 1=Jan … 12=Dec, central Europe
}
