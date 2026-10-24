'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Rating } from '@/components/common/Rating';
import { SizeChartModal } from '@/components/common/SizeChartModal';
import { productService } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { Product, ProductReview } from '@/types';
import {
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  Truck,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Flame,
  Star,
  MapPin
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincodeCheck, setPincodeCheck] = useState('600040');
  const [pincodeResult, setPincodeResult] = useState<string | null>('Express Delivery Available: 24-48 hrs across Tamil Nadu');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProductData() {
      setIsLoading(true);
      try {
        const prod = await productService.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedSize(prod.sizes[0] || 'M');
          setSelectedColor(prod.colors[0] || { name: 'Black', hex: '#000000' });

          const [related, revs] = await Promise.all([
            productService.getRelatedProducts(prod.category, prod.id, 4),
            reviewService.getReviewsForProduct(prod.id)
          ]);
          setRelatedProducts(related);
          setReviews(revs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadProductData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase font-mono text-zinc-400">Loading High-Performance Sportswear...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold uppercase mb-4">Product Not Found</h2>
          <p className="text-xs text-zinc-400 mb-6">The requested sportswear piece is unavailable or has moved.</p>
          <Link href="/shop">
            <Button variant="primary" size="md">BACK TO SPORT CATALOG</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please choose your athletic size & color variant', 'error');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sku: `${product.sku}-${selectedSize}-${selectedColor.name.substring(0, 3).toUpperCase()}`
    });

    setIsCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please choose your athletic size & color variant', 'error');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      sku: `${product.sku}-${selectedSize}-${selectedColor.name.substring(0, 3).toUpperCase()}`
    });

    router.push('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeCheck.trim().length === 6) {
      setPincodeResult('Express Delivery: 24-48 hrs via Delhivery Surface TN');
      showToast('Pincode serviceable for express delivery!', 'success');
    } else {
      setPincodeResult('Please enter a valid 6-digit Tamil Nadu pincode.');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setIsSubmittingReview(true);
    const added = await reviewService.addReview({
      productId: product.id,
      userName: 'Verified Athlete',
      userLocation: 'Tamil Nadu, IN',
      rating: newReviewRating,
      title: 'Customer Feedback',
      comment: newReviewText,
      verifiedPurchase: true
    });
    setIsSubmittingReview(false);
    setReviews([added, ...reviews]);
    setNewReviewText('');
    showToast('Thank you! Your verified review has been submitted.', 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] text-zinc-400 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link href={`/category/${product.categorySlug}`} className="hover:text-white transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-white font-bold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Badges & SKU */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
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
                  {product.discountPercentage > 0 && (
                    <Badge variant="discount" size="sm">
                      {product.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mt-2">
                <Rating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                <span className="text-zinc-600">|</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Authentic Sports Mens Wear
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-zinc-500 line-through">
                      MRP ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Inclusive of all taxes • Free Shipping above ₹999 in Tamil Nadu
                </p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-white text-black font-black text-xs uppercase tracking-wider">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-300">
                  Color: <strong className="text-white">{selectedColor?.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-2 border transition-all ${
                      selectedColor?.name === c.name
                        ? 'border-white bg-zinc-900 ring-1 ring-white'
                        : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-zinc-600 inline-block"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-bold text-white">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Chart Modal Button */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-300">
                  Select Athletic Size
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white font-bold uppercase tracking-wider text-[11px] underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-bold uppercase transition-all ${
                      selectedSize === s
                        ? 'bg-white text-black border border-white ring-2 ring-white/20'
                        : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Stock Status */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold text-zinc-400">Qty:</span>
                <div className="flex items-center border border-zinc-700 bg-zinc-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs">
                {product.inStock ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock ({product.stockCount} Units in TN Center)
                  </span>
                ) : (
                  <span className="text-red-400 font-bold">Temporarily Sold Out</span>
                )}
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="xl"
                  variant="primary"
                  fullWidth
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                >
                  ADD TO BAG
                </Button>

                <Button
                  size="xl"
                  variant="outline"
                  fullWidth
                  onClick={handleBuyNow}
                  leftIcon={<Zap className="w-4 h-4" />}
                  className="border-white hover:bg-white hover:text-black"
                >
                  BUY NOW
                </Button>
              </div>

              <button
                type="button"
                onClick={() =>
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
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`}
                />
                <span>{isWishlisted ? 'SAVED IN WISHLIST' : 'SAVE TO WISHLIST'}</span>
              </button>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase text-white">
                <MapPin className="w-4 h-4 text-white" />
                <span>Check Tamil Nadu Delivery Speed</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeCheck}
                  onChange={(e) => setPincodeCheck(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="bg-black border border-zinc-700 px-3 py-2 text-white font-mono flex-1 focus:border-white focus:outline-none"
                />
                <Button type="submit" size="sm" variant="outline">
                  CHECK
                </Button>
              </form>
              {pincodeResult && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{pincodeResult}</span>
                </p>
              )}
            </div>

            {/* Guarantees List */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-white flex-shrink-0" />
                <span>7-Day Doorstep Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white flex-shrink-0" />
                <span>High-Tensile Poly-Spandex</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs & Details Tabs */}
        <div className="mt-16 border-t border-zinc-800 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Description & Performance Fit */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Performance Engineering
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {product.description}
              </p>
              <div className="pt-2 text-xs">
                <span className="font-bold text-white uppercase">Fit Profile: </span>
                <span className="text-zinc-300">{product.fit}</span>
              </div>
            </div>

            {/* Fabric Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Fabric & Composition
              </h3>
              <p className="text-xs text-zinc-300 font-mono">
                {product.material}
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {product.fabricFeatures.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Athletic Care Guide
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {product.careInstructions.map((care, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full flex-shrink-0" />
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="mt-16 border-t border-zinc-800 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
                ATHLETE REVIEWS & TESTIMONIALS
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <Rating rating={product.rating} reviewCount={reviews.length} size="md" />
                <span className="text-xs text-zinc-400">Based on verified purchases</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 bg-zinc-950 border border-zinc-800 text-center space-y-2">
                  <p className="text-sm font-bold uppercase text-white">No Reviews Yet</p>
                  <p className="text-xs text-zinc-400">
                    Be the first athlete to test and review this gear! Submit your verified feedback using the form.
                  </p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Rating rating={rev.rating} showCount={false} size="sm" />
                        <span className="font-bold text-white">{rev.title}</span>
                      </div>
                      <span className="text-zinc-500 font-mono text-[11px]">{rev.date}</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rev.comment}</p>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-400">{rev.userName}</span>
                        <span>•</span>
                        <span>{rev.userLocation}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-emerald-400 font-bold ml-1">✓ Verified Buyer</span>
                        )}
                      </div>
                      <span>{rev.helpfulCount} found helpful</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box */}
            <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Review This Product
              </h3>
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Rating
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 px-3 py-2 text-white"
                  >
                    <option value={5}>5 Stars - Outstanding Performance</option>
                    <option value={4}>4 Stars - Great Quality</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Describe the fit, stretch, sweat wicking, and comfort during workouts..."
                    className="w-full bg-black border border-zinc-700 p-3 text-white placeholder-zinc-600 focus:border-white focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  isLoading={isSubmittingReview}
                >
                  SUBMIT VERIFIED REVIEW
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Related Products Recommendations */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-zinc-800 pt-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
                COMPLETE YOUR SPORT ROTATION
              </h2>
              <Link href={`/category/${product.categorySlug}`} className="text-xs font-bold uppercase tracking-wider text-white hover:underline">
                View All
              </Link>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </main>

      {/* Sticky Mobile Add-to-Bag Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white font-mono">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <p className="text-[10px] text-zinc-400">
            Size: <strong className="text-white">{selectedSize || 'M'}</strong> • {selectedColor?.name || 'Black'}
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={handleAddToCart}
          leftIcon={<ShoppingBag className="w-4 h-4" />}
          className="px-5 font-black uppercase text-xs tracking-wider shadow-glow"
        >
          ADD TO BAG
        </Button>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />

      <Footer />
    </div>
  );
}
