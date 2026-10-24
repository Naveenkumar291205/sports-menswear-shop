import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    slug: 't-shirts',
    tagline: 'High-Performance & Oversized Tees',
    description: 'Ultra-breathable, moisture-wicking and heavyweight oversized tees designed for high-performance and modern athletic streetwear.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    itemCount: 840,
    featured: true,
    subCategories: ['Performance Active Tees', 'Dry-Fit Crew Tees', '240 GSM Oversized Tees', 'Graphic Athletic Tees', 'Seamless Tops']
  },
  {
    id: 'cat-2',
    name: 'Polos & Collars',
    slug: 'polos',
    tagline: 'Sport-Luxe Collared Performance Polos',
    description: 'Refined athletic polo shirts combining breathable pique knit fabrics with structured rib collars for versatile sportswear.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    itemCount: 420,
    featured: true,
    subCategories: ['AeroPique Polos', 'Zip-Collar Tech Polos', 'Classic Athletic Polos', 'Quick-Dry Golf Polos']
  },
  {
    id: 'cat-3',
    name: 'Joggers',
    slug: 'joggers',
    tagline: 'Precision Tapered Athletic Fit',
    description: 'Modern slim-fit joggers featuring reinforced zippered pockets, breathable ankle cuffs, and premium poly-spandex blends.',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop',
    itemCount: 510,
    featured: true,
    subCategories: ['Cargo Joggers', 'Performance Tech Joggers', 'Fleece Workout Joggers', 'Tapered Street Joggers']
  },
  {
    id: 'cat-4',
    name: 'Track Pants',
    slug: 'track-pants',
    tagline: 'Rapid-Dry Track Performance',
    description: 'Designed for warm-ups, outdoor runs, and cool-downs across Tamil Nadu tropical climates.',
    image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=800&auto=format&fit=crop',
    itemCount: 430,
    featured: true,
    subCategories: ['Moisture-Wick Tracks', 'Zipper Cuff Tracks', 'Windproof Training Pants']
  },
  {
    id: 'cat-5',
    name: 'Shorts',
    slug: 'shorts',
    tagline: '2-in-1 Compression & Training Shorts',
    description: 'Featherlight shorts with built-in compression liners, phone stash pockets, and towel loops for total agility.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
    itemCount: 490,
    featured: true,
    subCategories: ['2-in-1 Compression Shorts', '5-Inch Running Shorts', '7-Inch Training Shorts', 'Casual Athletic Shorts']
  },
  {
    id: 'cat-6',
    name: 'Compression Wear',
    slug: 'compression-wear',
    tagline: 'Muscle Stabilization & Rapid Recovery',
    description: 'Targeted gradient compression that boosts blood circulation, decreases muscle vibration, and accelerates athletic recovery.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    itemCount: 380,
    featured: true,
    subCategories: ['Compression Full Tights', 'Compression Short Sleeves', 'Compression Long Sleeves', 'Base Layer Tops']
  },
  {
    id: 'cat-7',
    name: 'Tanks & Vests',
    slug: 'tanks-vests',
    tagline: 'Sleeveless Mobility & Muscle Vests',
    description: 'Drop-arm and scoop-neck muscle vests crafted with breathable combed cotton and stretch lycra for uninhibited movement.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    itemCount: 310,
    featured: false,
    subCategories: ['Drop-Arm Muscle Tanks', 'Sleeveless Athletic Vests', 'Ribbed Cutoff Tanks']
  },
  {
    id: 'cat-8',
    name: 'Jackets',
    slug: 'jackets',
    tagline: 'Thermal Guard & Windbreaker Ensembles',
    description: 'Lightweight zip jackets and windbreakers tailored for morning workouts, monsoon runs, and post-session commutes.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    itemCount: 340,
    featured: false,
    subCategories: ['Windbreakers', 'Tech Fleece Zip Jackets', 'Athletic Bomber Jackets', 'Rain Shells']
  },
  {
    id: 'cat-9',
    name: 'Sweatshirts & Hoodies',
    slug: 'sweatshirts',
    tagline: 'Warmth & Heavyweight Fleece',
    description: 'Minimalist athletic crewnecks and pullover hoodies crafted with anti-pilling French terry fleece.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    itemCount: 310,
    featured: false,
    subCategories: ['Athletic Crewnecks', 'Heavyweight Hoodies', 'Oversized Pullovers']
  },
  {
    id: 'cat-10',
    name: 'Innerwear',
    slug: 'innerwear',
    tagline: 'Chafe-Free Performance Base Layers',
    description: 'Microfiber bamboo & elastane athletic trunks engineered with anti-odor silver ions and flatlock seams.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
    itemCount: 290,
    featured: false,
    subCategories: ['Sport Performance Trunks', 'Anti-Chafe Boxer Briefs', 'Cooling Base Underwear']
  }
];
