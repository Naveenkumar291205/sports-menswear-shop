import { Category } from '@/types';
import { CATEGORIES } from '@/data/categories';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return CATEGORIES;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  async getFeaturedCategories(): Promise<Category[]> {
    return CATEGORIES.filter((c) => c.featured);
  }
};
