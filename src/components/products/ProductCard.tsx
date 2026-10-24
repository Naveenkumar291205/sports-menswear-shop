'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Badge } from '../common/Badge';
import { Rating } from '../common/Rating';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  priority = false
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Black', hex: '#000000' });
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      sku: `${product.sku}-${selectedSize}`
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      rating: product.rating,
      inStock: product.inStock,
      colors: product.colors,
      sizes: product.sizes
    });
  };

  return (
    <div
      className="group relative bg-zinc-950 border border-zinc-800/80 hover:border-zinc-500 transition-all duration-300 flex flex-col h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 block">
        {/* Main Product Image */}
        <Image
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient dark overlay at bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges Container Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is699Collection && (
            <Badge variant="new" size="sm">
              ₹699 SPECIAL
            </Badge>
          )}
          {product.isBestSeller && !product.is699Collection && (
            <Badge variant="bestseller" size="sm">
              BESTSELLER
            </Badge>
          )}
          {product.isNewArrival && !product.isBestSeller && !product.is699Collection && (
            <Badge variant="outline" size="sm">
              NEW
            </Badge>
          )}
          {product.discountPercentage > 0 && (
            <Badge variant="discount" size="sm">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="dark" size="sm" className="bg-red-950 text-red-400 border-red-800">
              OUT OF STOCK
            </Badge>
          )}
        </div>

        {/* Wishlist Button Top-Right */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className={`absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-none flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-white text-black shadow-lg shadow-white/10'
              : 'bg-black/70 text-white hover:bg-white hover:text-black border border-white/20'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-black text-black' : ''
            }`}
          />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-3 right-3 hidden sm:flex items-center justify-center gap-1.5 bg-black/85 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider py-2 border border-zinc-700 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick Preview
          </button>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span className="uppercase tracking-wider font-semibold truncate max-w-[60%]">
              {product.category}
            </span>
            <Rating rating={product.rating} reviewCount={product.reviewCount} size="sm" showCount={true} />
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-zinc-200 transition-colors">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Color Swatches */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-white font-mono">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Colors preview dots */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-zinc-600 inline-block"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-zinc-500 font-bold">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>

          {/* Quick Size Selection Strip */}
          <div className="mt-2.5 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              {product.sizes.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`min-w-[24px] px-1.5 py-1 text-[10px] font-bold border transition-colors ${
                    selectedSize === s
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {s}
                </button>
              ))}
              {product.sizes.length > 4 && (
                <button
                  key={product.sizes[4]}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(product.sizes[4]);
                  }}
                  className={`hidden sm:inline-block min-w-[24px] px-1.5 py-1 text-[10px] font-bold border transition-colors ${
                    selectedSize === product.sizes[4]
                      ? 'bg-white text-black border-white'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {product.sizes[4]}
                </button>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`p-2 min-w-[32px] min-h-[32px] flex items-center justify-center transition-all flex-shrink-0 ${
                isAdded
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-700'
              }`}
              title="Add to cart"
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
