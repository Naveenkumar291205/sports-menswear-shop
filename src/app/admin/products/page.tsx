'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/common/Button';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { productService } from '@/services/productService';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckSquare,
  Square,
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const res = await productService.getProducts({ limit: 100 });
      setProducts(res.products);
    }
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || p.categorySlug.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCat;
  });

  const handleSaveProduct = (updated: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? ({ ...p, ...updated } as Product) : p)));
      showToast(`Updated product "${updated.name}" successfully`, 'success');
    } else {
      setProducts([updated as Product, ...products]);
      showToast(`Added new product "${updated.name}" to catalog`, 'success');
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setProducts(products.filter((p) => p.id !== id));
      showToast(`Deleted "${name}"`, 'info');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="PRODUCT MANAGEMENT"
          subtitle={`Catalog Capacity: 5,000 SKUs • Total Loaded: ${products.length} Products`}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-4">
            <div className="flex flex-1 items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search product by title or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-xs pl-8 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-xs text-white px-3 py-2 uppercase font-bold focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="polos">Polos & Collars</option>
                <option value="joggers">Joggers</option>
                <option value="track-pants">Track Pants</option>
                <option value="shorts">Shorts</option>
                <option value="compression-wear">Compression</option>
                <option value="tanks-vests">Tanks & Vests</option>
                <option value="jackets">Jackets</option>
                <option value="sweatshirts">Sweatshirts & Hoodies</option>
                <option value="innerwear">Innerwear</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                ADD PRODUCT
              </Button>
            </div>
          </div>

          {/* Master Product Table */}
          <div className="bg-zinc-950 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-bold text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button onClick={toggleSelectAll} className="text-zinc-400 hover:text-white">
                      {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Sizes</th>
                  <th className="p-3">Spotlight</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3 text-center">
                        <button onClick={() => toggleSelectOne(p.id)}>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-zinc-600" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-white uppercase text-xs line-clamp-1">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-zinc-500">{p.fit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-white text-[11px]">{p.sku}</td>
                      <td className="p-3 uppercase text-[11px] font-semibold">{p.category}</td>
                      <td className="p-3 font-mono font-bold text-white">
                        ₹{p.price}{' '}
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-zinc-500 line-through">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold font-mono ${
                            p.stockCount <= 10
                              ? 'bg-red-950 text-red-400'
                              : 'bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          {p.stockCount} Units
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-zinc-400">
                        {p.sizes.join(', ')}
                      </td>
                      <td className="p-3">
                        {p.is699Collection ? (
                          <span className="px-1.5 py-0.5 bg-white text-black text-[9px] font-black uppercase">
                            ₹699
                          </span>
                        ) : p.isBestSeller ? (
                          <span className="px-1.5 py-0.5 bg-zinc-800 text-white text-[9px] font-bold uppercase">
                            Bestseller
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />
    </div>
  );
}
