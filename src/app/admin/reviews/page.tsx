'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Rating } from '@/components/common/Rating';
import { reviewService } from '@/services/reviewService';
import { ProductReview } from '@/types';
import { Star, CheckCircle2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    async function load() {
      const all = await reviewService.getAllReviews();
      setReviews(all);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="CUSTOMER REVIEWS & PRODUCT FEEDBACK"
          subtitle="Verified Athlete Ratings & Feedback from Tamil Nadu"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="bg-zinc-950 border border-zinc-800 p-12 text-center">
              <div className="w-16 h-16 bg-zinc-900 text-zinc-500 mx-auto flex items-center justify-center mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                No Customer Reviews Yet
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Customer reviews and ratings submitted on product pages will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-6 bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <Rating rating={r.rating} showCount={false} size="sm" />
                      <span className="font-bold text-white uppercase">{r.title}</span>
                    </div>
                    <span className="text-zinc-500 font-mono text-[11px]">{r.date}</span>
                  </div>
                  <p className="text-xs text-zinc-300">{r.comment}</p>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900">
                    <span>Author: <strong className="text-zinc-400">{r.userName}</strong> ({r.userLocation})</span>
                    <span className="text-emerald-400 font-bold">✓ Verified Purchase</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
