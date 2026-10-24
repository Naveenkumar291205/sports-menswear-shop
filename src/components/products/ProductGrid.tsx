'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onQuickView,
  columns = 4,
  emptyTitle = 'No Products Found',
  emptyMessage = 'Try adjusting your filters or search keywords to find what you are looking for.',
  onResetFilters
}) => {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  if (isLoading) {
    return (
      <div className={`grid ${colClasses[columns]} gap-4 sm:gap-6`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-zinc-950 border border-zinc-800 animate-pulse flex flex-col">
            <div className="aspect-[3/4] bg-zinc-900 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-zinc-800 w-1/3 rounded" />
              <div className="h-4 bg-zinc-800 w-3/4 rounded" />
              <div className="h-4 bg-zinc-800 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 p-12 text-center my-8">
        <div className="w-16 h-16 bg-zinc-900 text-zinc-400 mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-zinc-500" />
        </div>
        <h3 className="text-base font-bold uppercase tracking-wider text-white mb-2">{emptyTitle}</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">{emptyMessage}</p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Reset All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-4 sm:gap-6`}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          priority={idx < 4}
        />
      ))}
    </div>
  );
};
