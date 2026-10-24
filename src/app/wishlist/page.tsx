'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { Rating } from '@/components/common/Rating';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartDrawerOpen } = useCart();

  const handleMoveToCart = (item: typeof wishlist[0]) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      size: item.sizes[0] || 'M',
      color: item.colors[0] || { name: 'Black', hex: '#000000' },
      quantity: 1,
      sku: `ZZ-${item.productId}`
    });
    removeFromWishlist(item.productId);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="border-b border-zinc-800 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
              SAVED WISHLIST
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'Style' : 'Styles'} saved for later
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="border border-zinc-800 bg-zinc-950 p-16 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-zinc-900 mx-auto flex items-center justify-center mb-4 border border-zinc-800">
              <Heart className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-2">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-xs text-zinc-400 mb-8 leading-relaxed">
              Click the heart icon on any high-performance tee, jogger, or shorts to save it here.
            </p>
            <Link href="/shop">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                EXPLORE CATALOG
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-zinc-950 border border-zinc-800 flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[3/4] bg-zinc-900">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-2.5 right-2.5 p-2 bg-black/70 hover:bg-black text-white hover:text-red-400 border border-zinc-700"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">
                      {item.category}
                    </span>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-xs sm:text-sm font-bold uppercase text-white hover:text-zinc-300 line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-zinc-800">
                    <span className="text-sm font-bold text-white">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-zinc-500 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    fullWidth
                    onClick={() => handleMoveToCart(item)}
                    leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                  >
                    MOVE TO BAG
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
