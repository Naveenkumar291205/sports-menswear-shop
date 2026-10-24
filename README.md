# ⚡ SPORTS MENS WEAR | Zyphor Zone

> High-Performance Men's Activewear & Streetwear E-Commerce Platform with Integrated POS & Full Admin Management.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Overview

**Sports Mens Wear (Zyphor Zone)** is a full-featured, production-ready e-commerce platform tailored for modern athletic wear and performance streetwear. Designed with athletic typography, sleek dark aesthetic, rapid search and filtering, multi-step checkout, and an enterprise-grade administrative suite including a **Point of Sale (POS)** counter system.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Dynamic Hero & Curated Drops**: Showcasing trending drops, seasonal campaigns, and the signature **Under ₹699 Budget Performance Collection**.
- **Comprehensive Product Catalog**:
  - Filter by Category, Price Range, Size (`S` to `XXL`), Color, and Fit.
  - Quick Search with instant query matching.
  - Sorting by Price, Popularity, New Arrivals, and Rating.
- **Interactive Product Detail Pages**:
  - Multi-image zoom and preview gallery.
  - Color and size selection with live inventory stock indicators.
  - Interactive Size Chart Modal with metric/imperial measurements.
  - Material specifications, fabric technology highlights, and care guides.
  - Customer review submission and rating distribution breakdown.
- **Cart & Slide-out Cart Drawer**:
  - Real-time cart state with quantity adjustments.
  - Dynamic free shipping threshold progress tracker.
  - Coupon code application and instant discount calculation.
- **Streamlined Checkout**:
  - Multi-step checkout stepper (Shipping Address -> Payment Method -> Confirmation).
  - Multiple payment methods: UPI / QR, Cash on Delivery (COD), Cards, and Net Banking.
  - Animated order placement celebrations (Canvas Confetti).
  - Printable / downloadable digital receipts.
- **Order Tracking & Account**:
  - Step-by-step shipment timeline tracking (`Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`).
  - Saved addresses and profile management.
- **Wishlist & Saved Items**: Fast one-click toggle to save favorite styles across sessions.

---

### 💼 Back-Office & Admin Suite (`/admin`)
- **Dashboard & KPIs**: Real-time sales metrics, order counts, average order values, and inventory alerts.
- **POS (Point of Sale)**: Dedicated retail billing screen for in-store checkout, instant receipt printing, barcode/SKU scanning, and cash/card reconciliation.
- **Product Management**: Add, edit, manage variants (sizes, colors, stock), and batch CSV import.
- **Category Management**: Create and configure product lines with banner images, tags, and sub-categories.
- **Inventory Tracking**: Stock level alerts, reorder thresholds, and warehouse allocation.
- **Orders & Shipments**: Status transition workflows, tracking number updates, and invoice printing.
- **Coupons & Promotional Rules**: Percentage and flat discount codes with minimum spend requirements.
- **Returns & Exchanges**: Return request handling, inspection status, and refund processing.
- **Customer Directory**: Customer profiles, lifetime value (LTV), and purchase history.
- **Analytics & Reports**: Revenue reports, best-performing styles, and stock velocity.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Client & Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing for robust e-commerce logic)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context (`CartContext`, `AuthContext`, `WishlistContext`, `ToastContext`)
- **Visuals & Effects**: `canvas-confetti`, `clsx`, `tailwind-merge`

---

## 📂 Project Structure

```bash
sports-menswear-shop/
├── public/                 # Static assets, branding & placeholder imagery
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Storefront Homepage
│   │   ├── shop/           # Catalog & Product Listing
│   │   ├── product/[slug]/ # Product Detail Page
│   │   ├── category/[slug]/# Category-specific Catalog
│   │   ├── cart/           # Full Cart Page
│   │   ├── checkout/       # Multi-step Checkout Flow
│   │   ├── wishlist/       # User Wishlist
│   │   ├── account/        # User Profile & Order History
│   │   ├── order-success/  # Order Confirmation & Receipt
│   │   ├── search/         # Search Results
│   │   ├── offers/         # Active Deals & Discount Page
│   │   ├── contact/        # Contact & Store Locator
│   │   ├── about/          # Brand Story & Heritage
│   │   └── admin/          # Admin Suite & POS System
│   │       ├── pos/        # In-store Point of Sale
│   │       ├── products/   # Product CRUD & CSV Import
│   │       ├── orders/     # Order Processing & Tracking
│   │       ├── inventory/  # Inventory Control
│   │       ├── categories/ # Category Config
│   │       ├── coupons/    # Coupon Management
│   │       ├── customers/  # Customer Profiles
│   │       ├── returns/    # Returns & Exchanges
│   │       ├── reviews/    # Review Moderation
│   │       ├── reports/    # Sales & Analytics Reports
│   │       └── settings/   # Store & Payment Settings
│   ├── components/         # Reusable UI Components
│   │   ├── admin/          # Admin Header, Sidebar, Product Modals
│   │   ├── cart/           # Cart Drawer & Cart Row items
│   │   ├── checkout/       # Address Modal, Stepper, Payment Cards
│   │   ├── common/         # Buttons, Badges, Modals, Logo, Rating
│   │   ├── layout/         # Header, Footer, Mobile Navigation
│   │   └── products/       # Product Card, Product Grid, Gallery, Filters
│   ├── context/            # React Context Providers
│   ├── data/               # Seed data (products, categories, stores, orders)
│   ├── services/           # Business logic & data access layer
│   └── types/              # TypeScript interface definitions
├── .eslintrc.json          # Linting rules
├── .gitignore              # Ignored files (node_modules, build artifacts)
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration & design tokens
└── tsconfig.json           # TypeScript configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or later
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Naveenkumar291205/sports-menswear-shop.git
   cd sports-menswear-shop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Storefront: [http://localhost:3000](http://localhost:3000)
   - Admin Suite: [http://localhost:3000/admin](http://localhost:3000/admin)
   - POS Counter: [http://localhost:3000/admin/pos](http://localhost:3000/admin/pos)

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server with hot-reloading |
| `npm run build` | Compiles the production build |
| `npm run start` | Boots the optimized production server |
| `npm run lint` | Runs ESLint checks across the codebase |

---

## 🏷️ Categories & Collections

- 👕 **T-Shirts**: Performance Active, 240 GSM Oversized Tees, Dry-Fit Crew Tops
- 👔 **Polos & Collars**: AeroPique Polos, Zip-Collar Tech Polos
- 🏃 **Joggers & Track Pants**: Slim-fit zippered joggers, rapid-dry workout tracks
- 🩳 **Shorts**: 2-in-1 Compression Shorts, 5-inch & 7-inch Training Shorts
- 🧥 **Jackets & Outerwear**: Windbreakers, Zip Hoodies, Winter Training Gear
- 🔥 **Under ₹699 Collection**: Value-engineered athletic daily essentials

---

## 👤 Author

**Naveen Kumar M**
- GitHub: [@Naveenkumar291205](https://github.com/Naveenkumar291205)
- Repository: [sports-menswear-shop](https://github.com/Naveenkumar291205/sports-menswear-shop)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use and customize for your own sporting apparel store!