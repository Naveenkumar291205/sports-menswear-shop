import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/common/AuthModal';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';

export const metadata: Metadata = {
  title: 'SPORTS MENS WEAR | Built For Movement — Premium Men\'s Sportswear',
  description: 'Engineered for high-performance training, lifting, and athletic streetwear. ₹699 Signature Collection, fast delivery across Tamil Nadu.',
  keywords: ['men sportswear', 'gym wear', 'tamil nadu gym clothing', 'compression tights', 'joggers', 'sports mens wear', 'athletic tees', '699 sportswear'],
  openGraph: {
    title: 'SPORTS MENS WEAR | Built For Movement',
    description: 'High-performance men\'s sportswear engineered for movement and athletic lifestyle.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'SPORTS MENS WEAR'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-black text-white selection:bg-white selection:text-black">
      <body className="min-h-screen bg-black text-white flex flex-col antialiased pb-16 md:pb-0">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <CartDrawer />
                <AuthModal />
                <MobileBottomBar />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
