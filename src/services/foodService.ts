import { foodData } from '@/data/foodItems';
import { FoodItem, FoodCategory } from '@/types/food';

export const FoodService = {
  async getFoodItems(params?: { search?: string; category?: FoodCategory | 'All' }): Promise<FoodItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...foodData];
    
    if (params?.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.nameDE.toLowerCase().includes(term)
      );
    }
    
    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(item => item.category === params.category);
    }
    
    return filtered;
  }
};
