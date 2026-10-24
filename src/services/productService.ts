import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

export interface ProductFilterParams {
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  inStockOnly?: boolean;
  minRating?: number;
  discountOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'recommended' | 'newest' | 'bestselling' | 'price-asc' | 'price-desc' | 'rating';
  is699Only?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  availableMaterials: string[];
  priceRange: { min: number; max: number };
}

/**
 * Service to interact with Product data.
 * When Django backend is ready, replace local mock calls with:
 * return (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`, ...)).json();
 */
export const productService = {
  async getProducts(params: ProductFilterParams = {}): Promise<PaginatedProductsResponse> {
    // Simulate slight network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 50));

    let filtered = [...PRODUCTS];

    if (params.searchQuery && params.searchQuery.trim()) {
      const q = params.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    if (params.category && params.category !== 'all') {
      const catSlug = params.category.toLowerCase();
      filtered = filtered.filter(
        (p) => p.categorySlug.toLowerCase() === catSlug || p.category.toLowerCase() === catSlug
      );
    }

    if (params.subCategory) {
      filtered = filtered.filter((p) => p.subCategory?.toLowerCase() === params.subCategory?.toLowerCase());
    }

    if (params.is699Only) {
      filtered = filtered.filter((p) => p.is699Collection || p.price === 699);
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= (params.minPrice || 0));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= (params.maxPrice || 99999));
    }

    if (params.sizes && params.sizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((size) => params.sizes?.includes(size))
      );
    }

    if (params.colors && params.colors.length > 0) {
      filtered = filtered.filter((p) =>
        p.colors.some((c) => params.colors?.includes(c.name))
      );
    }

    if (params.materials && params.materials.length > 0) {
      filtered = filtered.filter((p) =>
        params.materials?.some((m) => p.material.toLowerCase().includes(m.toLowerCase()))
      );
    }

    if (params.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock && p.stockCount > 0);
    }

    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= (params.minRating || 0));
    }

    if (params.discountOnly) {
      filtered = filtered.filter((p) => p.discountPercentage > 0);
    }

    // Sorting
    switch (params.sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'bestselling':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    const totalCount = filtered.length;
    const page = params.page || 1;
    const limit = params.limit || 12;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const paginatedProducts = filtered.slice((page - 1) * limit, page * limit);

    // Extract unique filter options from master catalog
    const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colorMap = new Map<string, string>();
    PRODUCTS.forEach((p) => p.colors.forEach((c) => colorMap.set(c.name, c.hex)));
    const allColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
    const allMaterials = ['Poly-Coolmax', 'Tech Poly', 'Combed Cotton', 'French Terry', 'Ripstop Nylon', 'Bamboo Micro-Modal'];

    const prices = PRODUCTS.map((p) => p.price);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);

    return {
      products: paginatedProducts,
      totalCount,
      currentPage: page,
      totalPages,
      availableSizes: allSizes,
      availableColors: allColors,
      availableMaterials: allMaterials,
      priceRange: { min: minP, max: maxP }
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return PRODUCTS.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
  },

  async getBestSellers(limit = 8): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit);
  },

  async get699Collection(limit = 8): Promise<Product[]> {
    return PRODUCTS.filter((p) => p.is699Collection || p.price === 699).slice(0, limit);
  },

  async getRelatedProducts(category: string, currentProductId: string, limit = 4): Promise<Product[]> {
    return PRODUCTS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase() && p.id !== currentProductId
    ).slice(0, limit);
  },

  async searchSuggestions(query: string): Promise<{ products: Product[]; categories: string[]; popularKeywords: string[] }> {
    if (!query || query.trim().length === 0) {
      return {
        products: [],
        categories: [],
        popularKeywords: ['Performance Tees', 'Polo Shirts', 'Tapered Joggers', '₹699 Collection', '2-in-1 Shorts', '240 GSM Oversized', 'Windbreakers']
      };
    }

    const q = query.toLowerCase().trim();
    const matchedProducts = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedCats = Array.from(
      new Set(
        PRODUCTS.filter((p) => p.category.toLowerCase().includes(q) || p.subCategory?.toLowerCase().includes(q))
          .map((p) => p.category)
      )
    );

    return {
      products: matchedProducts,
      categories: matchedCats,
      popularKeywords: []
    };
  }
};
