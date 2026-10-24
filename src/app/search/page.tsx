'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/common/Button';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';

function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trendingTags = [
    'black gym t shirt',
    '₹699 joggers',
    'compression tights',
    '2-in-1 shorts',
    '240 gsm oversized',
    'windbreaker',
    'seamless tee'
  ];

  useEffect(() => {
    // Load recent searches
    try {
      const stored = localStorage.getItem('zyphor_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {}

    // Load recommendations
    async function loadRecs() {
      const best = await productService.getBestSellers(4);
      setRecommended(best);
    }
    loadRecs();
  }, []);

  const executeSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await productService.getProducts({ searchQuery: term, limit: 20 });
      setResults(res.products);

      // Save to recent searches
      const updatedRecent = Array.from(new Set([term, ...recentSearches])).slice(0, 6);
      setRecentSearches(updatedRecent);
      localStorage.setItem('zyphor_recent_searches', JSON.stringify(updatedRecent));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      executeSearch(query);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    executeSearch(tag);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('zyphor_recent_searches');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Search Header Form */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
            SEARCH ATHLETIC CATALOG
          </h1>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, category, SKU (e.g. black gym t shirt)..."
              className="w-full bg-zinc-950 border-2 border-zinc-700 focus:border-white text-white text-sm sm:text-base px-12 py-4 placeholder-zinc-500 focus:outline-none transition-colors shadow-2xl"
            />
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Trending Search Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-white" /> Popular:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs transition-colors font-medium capitalize"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-zinc-500 font-bold uppercase text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent:
              </span>
              {recentSearches.map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => handleTagClick(rec)}
                  className="px-2 py-0.5 bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 text-[11px]"
                >
                  {rec}
                </button>
              ))}
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-zinc-500 hover:text-red-400 underline ml-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Results Area */}
        {query ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                Results for &ldquo;{query}&rdquo; ({results.length})
              </h2>
            </div>

            <ProductGrid
              products={results}
              isLoading={isLoading}
              columns={4}
              emptyTitle={`No sport gear found matching "${query}"`}
              emptyMessage="Try checking the spelling or searching for a broader term like 'T-Shirts' or 'Joggers'."
            />
          </div>
        ) : null}

        {/* Popular Recommendations when empty */}
        {(!query || results.length === 0) && (
          <div className="mt-16 border-t border-zinc-800 pt-10">
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              TRENDING ATHLETE PICKS
            </h3>
            <ProductGrid products={recommended} columns={4} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-8">Loading search...</div>}>
      <SearchInner />
    </Suspense>
  );
}
