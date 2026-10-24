'use client';

import React from 'react';
import { ProductFilterParams } from '@/services/productService';
import { CATEGORIES } from '@/data/categories';
import { Check, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: ProductFilterParams;
  onChange: (updated: ProductFilterParams) => void;
  onReset: () => void;
  availableSizes?: string[];
  availableColors?: { name: string; hex: string }[];
  availableMaterials?: string[];
  totalResults?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'],
  availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#71717A' },
    { name: 'Onyx', hex: '#111111' }
  ],
  availableMaterials = ['Poly-Coolmax', 'Tech Poly', 'Combed Cotton', 'French Terry', 'Ripstop Nylon'],
  totalResults
}) => {
  const toggleSize = (size: string) => {
    const current = filters.sizes || [];
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    onChange({ ...filters, sizes: updated, page: 1 });
  };

  const toggleColor = (colorName: string) => {
    const current = filters.colors || [];
    const updated = current.includes(colorName)
      ? current.filter((c) => c !== colorName)
      : [...current, colorName];
    onChange({ ...filters, colors: updated, page: 1 });
  };

  const toggleMaterial = (mat: string) => {
    const current = filters.materials || [];
    const updated = current.includes(mat)
      ? current.filter((m) => m !== mat)
      : [...current, mat];
    onChange({ ...filters, materials: updated, page: 1 });
  };

  const hasActiveFilters =
    Boolean(filters.category && filters.category !== 'all') ||
    Boolean(filters.sizes && filters.sizes.length > 0) ||
    Boolean(filters.colors && filters.colors.length > 0) ||
    Boolean(filters.materials && filters.materials.length > 0) ||
    Boolean(filters.inStockOnly) ||
    Boolean(filters.discountOnly) ||
    Boolean(filters.is699Only) ||
    Boolean(filters.minPrice || filters.maxPrice);

  return (
    <div className="space-y-6 text-xs text-zinc-300">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-white" />
          <span className="font-bold uppercase tracking-wider text-white text-sm">Filters</span>
          {totalResults !== undefined && (
            <span className="text-zinc-500 font-medium">({totalResults})</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* ₹699 Signature Collection Quick Switch */}
      <div className="bg-zinc-900/60 p-3 border border-zinc-800 flex items-center justify-between">
        <div>
          <p className="font-bold text-white uppercase text-xs">₹699 Spotlight</p>
          <p className="text-[10px] text-zinc-400">View direct ₹699 essentials</p>
        </div>
        <input
          type="checkbox"
          checked={Boolean(filters.is699Only)}
          onChange={(e) => onChange({ ...filters, is699Only: e.target.checked, page: 1 })}
          className="w-4 h-4 accent-white cursor-pointer"
        />
      </div>

      {/* Category Accordion / List */}
      <div className="space-y-2.5 pb-4 border-b border-zinc-800">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onChange({ ...filters, category: 'all', page: 1 })}
            className={`w-full text-left py-1 px-2 text-xs flex items-center justify-between transition-colors ${
              !filters.category || filters.category === 'all'
                ? 'bg-white text-black font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category?.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ ...filters, category: cat.slug, page: 1 })}
                className={`w-full text-left py-1.5 px-2 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizing Filter */}
      <div className="space-y-2.5 pb-4 border-b border-zinc-800">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Size</h4>
        <div className="grid grid-cols-5 gap-1.5">
          {availableSizes.map((size) => {
            const isSelected = filters.sizes?.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`py-2 text-xs font-bold uppercase transition-all ${
                  isSelected
                    ? 'bg-white text-black border border-white'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-500'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="space-y-2.5 pb-4 border-b border-zinc-800">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Color</h4>
        <div className="space-y-1.5">
          {availableColors.map((color) => {
            const isSelected = filters.colors?.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color.name)}
                className={`w-full flex items-center justify-between p-1.5 text-xs transition-colors ${
                  isSelected ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-zinc-600 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pb-4 border-b border-zinc-800">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase">Min (₹)</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              placeholder="0"
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
              className="w-full bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-white placeholder-zinc-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase">Max (₹)</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              placeholder="2500"
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
              className="w-full bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-xs text-white placeholder-zinc-500"
            />
          </div>
        </div>
      </div>

      {/* Fabric / Material */}
      <div className="space-y-2 pb-4 border-b border-zinc-800">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Fabric & Tech</h4>
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {availableMaterials.map((mat) => {
            const isSelected = filters.materials?.includes(mat);
            return (
              <label
                key={mat}
                className="flex items-center gap-2 py-1 text-xs text-zinc-400 hover:text-white cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isSelected || false}
                  onChange={() => toggleMaterial(mat)}
                  className="accent-white cursor-pointer"
                />
                <span className="truncate">{mat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability & Discounts */}
      <div className="space-y-2">
        <h4 className="font-bold uppercase tracking-wider text-white text-xs">Availability & Deals</h4>
        <label className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked, page: 1 })}
            className="accent-white cursor-pointer"
          />
          <span>In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.discountOnly)}
            onChange={(e) => onChange({ ...filters, discountOnly: e.target.checked, page: 1 })}
            className="accent-white cursor-pointer"
          />
          <span>Discounted Products</span>
        </label>
      </div>
    </div>
  );
};
