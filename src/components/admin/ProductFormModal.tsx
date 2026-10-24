'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Product } from '@/types';
import { CATEGORIES } from '@/data/categories';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
  initialProduct?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'T-Shirts',
    subCategory: 'Performance Active Tees',
    price: 699,
    originalPrice: 1299,
    discountPercentage: 46,
    stockCount: 50,
    material: 'Poly-Coolmax Breathable Mesh',
    fit: 'Athletic Muscle Fit',
    shortDescription: '',
    description: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'] as ('S' | 'M' | 'L' | 'XL' | 'XXL')[],
    colors: [{ name: 'Onyx Black', hex: '#111111' }, { name: 'Pure White', hex: '#FFFFFF' }],
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    is699Collection: true,
    inStock: true,
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name,
        sku: initialProduct.sku,
        category: initialProduct.category,
        subCategory: initialProduct.subCategory || 'Gym T-Shirts',
        price: initialProduct.price,
        originalPrice: initialProduct.originalPrice,
        discountPercentage: initialProduct.discountPercentage,
        stockCount: initialProduct.stockCount,
        material: initialProduct.material,
        fit: initialProduct.fit,
        shortDescription: initialProduct.shortDescription,
        description: initialProduct.description,
        sizes: initialProduct.sizes,
        colors: initialProduct.colors,
        images: initialProduct.images,
        isFeatured: Boolean(initialProduct.isFeatured),
        isBestSeller: Boolean(initialProduct.isBestSeller),
        isNewArrival: Boolean(initialProduct.isNewArrival),
        is699Collection: Boolean(initialProduct.is699Collection),
        inStock: initialProduct.inStock,
        seoTitle: initialProduct.seoTitle || '',
        seoDescription: initialProduct.seoDescription || ''
      });
    }
  }, [initialProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.name === formData.category);
    onSave({
      ...formData,
      id: initialProduct?.id || `prod-${Date.now()}`,
      slug: initialProduct?.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categorySlug: cat?.slug || 't-shirts',
      rating: initialProduct?.rating || 5.0,
      reviewCount: initialProduct?.reviewCount || 1,
      fabricFeatures: ['Dry-Fit Technology', '4-Way Stretch', 'Anti-Odor Bio-Shield'],
      careInstructions: ['Machine wash cold', 'Do not iron on print']
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'EDIT PRODUCT SPECIFICATIONS' : 'ADD NEW SPORT PRODUCT'}
      subtitle="Catalog Capacity: 5,000 SKUs • Multi-Channel Sync"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Core details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. SMW AeroTech Seamless Gym Tee"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              SKU Code *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="ZZ-TSH-901"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Categories and Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-zinc-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-bold focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              MRP / Original (₹) *
            </label>
            <input
              type="number"
              required
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Initial Total Stock *
            </label>
            <input
              type="number"
              required
              value={formData.stockCount}
              onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Fabric & Fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Material Composition
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="88% Poly-Coolmax, 12% Spandex"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Fit Type
            </label>
            <input
              type="text"
              value={formData.fit}
              onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
              placeholder="Athletic Muscle Fit / Oversized Boxy"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Short Description
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="One line highlight for catalog card"
            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Full Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed technical specifications, benefits and athletic engineering notes..."
            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Primary Image URL
          </label>
          <input
            type="url"
            value={formData.images[0] || ''}
            onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono text-[11px] focus:border-white focus:outline-none"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/60 p-3 border border-zinc-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.is699Collection}
              onChange={(e) => setFormData({ ...formData, is699Collection: e.target.checked })}
              className="accent-white"
            />
            <span className="font-bold text-white">₹699 Spotlight</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="accent-white"
            />
            <span>Featured Gear</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              className="accent-white"
            />
            <span>Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              className="accent-white"
            />
            <span>New Arrival</span>
          </label>
        </div>

        {/* SEO Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              SEO Meta Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="SMW Performance Tee | ₹699 Sportswear"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              SEO Meta Description
            </label>
            <input
              type="text"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="Shop high performance sportswear online in Tamil Nadu..."
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            SAVE TO CATALOG
          </Button>
        </div>
      </form>
    </Modal>
  );
};
