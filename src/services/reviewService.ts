import { ProductReview, ReturnRequest } from '@/types';
import { REVIEWS } from '@/data/reviews';

let inMemoryReviews = [...REVIEWS];

export const reviewService = {
  async getReviewsForProduct(productId: string): Promise<ProductReview[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return inMemoryReviews.filter((r) => r.productId === productId);
  },

  async getAllReviews(): Promise<ProductReview[]> {
    return inMemoryReviews;
  },

  async addReview(review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>): Promise<ProductReview> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      helpfulCount: 0
    };
    inMemoryReviews = [newRev, ...inMemoryReviews];
    return newRev;
  },

  async markHelpful(reviewId: string): Promise<void> {
    const rev = inMemoryReviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.helpfulCount += 1;
    }
  }
};
