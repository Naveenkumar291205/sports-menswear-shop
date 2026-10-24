'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { FilterPanel } from '@/components/products/FilterPanel';
import { Drawer } from '@/components/common/Drawer';
import { categoryService } from '@/services/categoryService';
import { productService, ProductFilterParams, PaginatedProductsResponse } from '@/services/productService';
import { Category } from '@/types';
import { ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [data, setData] = useState<PaginatedProductsResponse | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilterParams>({
    category: slug,
    sortBy: 'recommended',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    async function loadCategory() {
      const cat = await categoryService.getCategoryBySlug(slug);
      setCategory(cat);
    }
    if (slug) {
      loadCategory();
      setFilters((prev) => ({ ...prev, category: slug, page: 1 }));
    }
  }, [slug]);

  useEffect(() => {
    async function loadProducts() {
      const queryParams: ProductFilterParams = {
        ...filters,
        category: slug,
        subCategory: selectedSubCategory || undefined
      };
      const res = await productService.getProducts(queryParams);
      setData(res);
    }
    if (slug) {
      loadProducts();
    }
  }, [slug, filters, selectedSubCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Category Hero Banner */}
        {category && (
          <div className="relative aspect-[16/6] min-h-[220px] w-full bg-zinc-950 border border-zinc-800 mb-8 overflow-hidden flex flex-col justify-end p-6 sm:p-10">
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 space-y-2 max-w-2xl">
              <nav className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/categories" className="hover:text-white">Categories</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white">{category.name}</span>
              </nav>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        )}

        {/* Subcategories Filter Pills */}
        {category?.subCategories && category.subCategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <button
              onClick={() => setSelectedSubCategory(null)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
                selectedSubCategory === null
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              All {category.name}
            </button>
            {category.subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub === selectedSubCategory ? null : sub)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-colors ${
                  selectedSubCategory === sub
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800 text-xs">
          <span className="text-zinc-400">
            Showing <strong className="text-white">{data?.totalCount || 0}</strong> Styles
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-xs font-bold uppercase text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as ProductFilterParams['sortBy'],
                  page: 1
                })
              }
              className="bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 font-bold uppercase text-xs focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="bestselling">Best Selling</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 bg-zinc-950 border border-zinc-800 p-5">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ category: slug, page: 1 })}
                availableSizes={data?.availableSizes}
                availableColors={data?.availableColors}
                availableMaterials={data?.availableMaterials}
                totalResults={data?.totalCount}
              />
            </div>
          </aside>

          <div className="lg:col-span-3">
            <ProductGrid products={data ? data.products : []} columns={3} />
          </div>
        </div>
      </main>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="FILTERS"
        width="md"
      >
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters({ category: slug, page: 1 })}
          availableSizes={data?.availableSizes}
          availableColors={data?.availableColors}
          availableMaterials={data?.availableMaterials}
          totalResults={data?.totalCount}
        />
      </Drawer>

      <Footer />
    </div>
  );
}
