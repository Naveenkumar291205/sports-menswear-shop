'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FilterPanel } from '@/components/products/FilterPanel';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/common/Button';
import { Drawer } from '@/components/common/Drawer';
import { productService, ProductFilterParams, PaginatedProductsResponse } from '@/services/productService';
import { Product } from '@/types';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilterParams>({
    category: searchParams.get('category') || 'all',
    searchQuery: searchParams.get('q') || '',
    is699Only: searchParams.get('collection') === '699',
    sortBy: searchParams.get('filter') === 'bestseller'
      ? 'bestselling'
      : searchParams.get('filter') === 'new'
      ? 'newest'
      : 'recommended',
    page: 1,
    limit: 12
  });

  const [data, setData] = useState<PaginatedProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);

  // Sync with searchParams if they change
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const col = searchParams.get('collection');
    const filt = searchParams.get('filter');

    setFilters((prev) => ({
      ...prev,
      category: cat || prev.category || 'all',
      searchQuery: q !== null ? q : prev.searchQuery,
      is699Only: col === '699' ? true : prev.is699Only,
      sortBy: filt === 'bestseller' ? 'bestselling' : filt === 'new' ? 'newest' : prev.sortBy
    }));
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const res = await productService.getProducts(filters);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      is699Only: false,
      sortBy: 'recommended',
      page: 1,
      limit: 12,
      sizes: [],
      colors: [],
      materials: [],
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      discountOnly: false
    });
  };

  const removeFilterChip = (key: keyof ProductFilterParams, val?: string) => {
    if (key === 'sizes' && val) {
      setFilters({ ...filters, sizes: filters.sizes?.filter((s) => s !== val), page: 1 });
    } else if (key === 'colors' && val) {
      setFilters({ ...filters, colors: filters.colors?.filter((c) => c !== val), page: 1 });
    } else if (key === 'materials' && val) {
      setFilters({ ...filters, materials: filters.materials?.filter((m) => m !== val), page: 1 });
    } else if (key === 'category') {
      setFilters({ ...filters, category: 'all', page: 1 });
    } else if (key === 'is699Only') {
      setFilters({ ...filters, is699Only: false, page: 1 });
    } else if (key === 'searchQuery') {
      setFilters({ ...filters, searchQuery: '', page: 1 });
    } else {
      setFilters({ ...filters, [key]: undefined, page: 1 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
              SPORTS MENS WEAR • PERFORMANCE WEAR
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
              {filters.is699Only
                ? '₹699 SIGNATURE COLLECTION'
                : filters.category && filters.category !== 'all'
                ? `${filters.category.toUpperCase()} CATALOG`
                : filters.searchQuery
                ? `SEARCH: "${filters.searchQuery}"`
                : 'ALL SPORT CATALOG'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {data ? data.totalCount : '...'} high-performance styles engineered for movement
            </p>
          </div>

          {/* Controls: Mobile Filter Button + Sort Dropdown + Column Toggles */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs">
              <span className="text-zinc-400 font-medium uppercase text-[10px] hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as ProductFilterParams['sortBy'],
                    page: 1
                  })
                }
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer uppercase text-xs"
              >
                <option value="recommended" className="bg-zinc-950 text-white">Recommended</option>
                <option value="newest" className="bg-zinc-950 text-white">Newest Drops</option>
                <option value="bestselling" className="bg-zinc-950 text-white">Best Selling</option>
                <option value="price-asc" className="bg-zinc-950 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-zinc-950 text-white">Price: High to Low</option>
                <option value="rating" className="bg-zinc-950 text-white">Highest Rated</option>
              </select>
            </div>

            {/* Grid Column Layout Toggles on Desktop */}
            <div className="hidden sm:flex items-center border border-zinc-800 bg-zinc-900">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-2 transition-colors ${
                  gridColumns === 3 ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-2 transition-colors ${
                  gridColumns === 4 ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {data && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filters.category && filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Category: <strong className="uppercase">{filters.category}</strong>
                <button onClick={() => removeFilterChip('category')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.is699Only && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Price: <strong>₹699 Only</strong>
                <button onClick={() => removeFilterChip('is699Only')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Search: <strong>&ldquo;{filters.searchQuery}&rdquo;</strong>
                <button onClick={() => removeFilterChip('searchQuery')} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.sizes?.map((size) => (
              <span key={size} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Size: <strong>{size}</strong>
                <button onClick={() => removeFilterChip('sizes', size)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.colors?.map((color) => (
              <span key={color} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Color: <strong>{color}</strong>
                <button onClick={() => removeFilterChip('colors', color)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.materials?.map((mat) => (
              <span key={mat} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white">
                Fabric: <strong>{mat}</strong>
                <button onClick={() => removeFilterChip('materials', mat)} className="hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Master Catalog Body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-zinc-950 border border-zinc-800 p-5">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                availableSizes={data?.availableSizes}
                availableColors={data?.availableColors}
                availableMaterials={data?.availableMaterials}
                totalResults={data?.totalCount}
              />
            </div>
          </aside>

          {/* Product Grid & Pagination Area */}
          <div className="lg:col-span-3 space-y-8">
            <ProductGrid
              products={data ? data.products : []}
              isLoading={isLoading}
              columns={gridColumns}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                <div className="text-xs text-zinc-400">
                  Page <strong className="text-white">{data.currentPage}</strong> of{' '}
                  <strong className="text-white">{data.totalPages}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.currentPage <= 1}
                    onClick={() => setFilters({ ...filters, page: data.currentPage - 1 })}
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setFilters({ ...filters, page: pg })}
                        className={`w-8 h-8 text-xs font-mono font-bold transition-colors ${
                          pg === data.currentPage
                            ? 'bg-white text-black font-extrabold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.currentPage >= data.totalPages}
                    onClick={() => setFilters({ ...filters, page: data.currentPage + 1 })}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="FILTER SPORT CATALOG"
        subtitle={`Showing ${data?.totalCount || 0} styles`}
        width="md"
      >
        <FilterPanel
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
          }}
          onReset={handleResetFilters}
          availableSizes={data?.availableSizes}
          availableColors={data?.availableColors}
          availableMaterials={data?.availableMaterials}
          totalResults={data?.totalCount}
        />
        <div className="mt-8 pt-4 border-t border-zinc-800">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            VIEW {data?.totalCount || 0} PRODUCTS
          </Button>
        </div>
      </Drawer>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
