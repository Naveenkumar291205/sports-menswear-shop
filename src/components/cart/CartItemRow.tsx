'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false
}) => {
  return (
    <div className={`flex gap-3 sm:gap-4 py-4 border-b border-zinc-800/80 items-start ${compact ? 'py-3' : 'py-4'}`}>
      {/* Thumbnail */}
      <Link
        href={`/product/${item.slug}`}
        className={`relative ${compact ? 'w-16 h-20' : 'w-20 h-24 sm:w-24 sm:h-28'} bg-zinc-900 flex-shrink-0 border border-zinc-800 overflow-hidden`}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover object-center hover:scale-105 transition-transform"
        />
      </Link>

      {/* Item info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/product/${item.slug}`}
              className="text-xs sm:text-sm font-bold uppercase tracking-tight text-white hover:text-zinc-300 transition-colors line-clamp-1"
            >
              {item.name}
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
            <span>
              Size: <strong className="text-white font-bold">{item.size}</strong>
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                style={{ backgroundColor: item.color.hex }}
              />
              <span>{item.color.name}</span>
            </div>
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between mt-3 pt-2">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-zinc-700 bg-zinc-900">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="px-2.5 text-xs font-mono font-bold text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <div className="text-xs sm:text-sm font-bold text-white">
              ₹{item.price * item.quantity}
            </div>
            {item.originalPrice > item.price && (
              <div className="text-[10px] text-zinc-500 line-through">
                ₹{item.originalPrice * item.quantity}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
