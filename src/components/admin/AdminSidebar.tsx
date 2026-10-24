'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  FileSpreadsheet,
  Store,
  Users,
  Tag,
  RotateCcw,
  Star,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Bulk Import', href: '/admin/products/import', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { name: 'Categories', href: '/admin/categories', icon: <Layers className="w-4 h-4" /> },
    { name: 'Inventory Matrix', href: '/admin/inventory', icon: <Boxes className="w-4 h-4" /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Physical POS', href: '/admin/pos', icon: <Store className="w-4 h-4" />, badge: 'Retail' },
    { name: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { name: 'Coupons & Deals', href: '/admin/coupons', icon: <Tag className="w-4 h-4" /> },
    { name: 'Returns & Exchange', href: '/admin/returns', icon: <RotateCcw className="w-4 h-4" /> },
    { name: 'Reviews', href: '/admin/reviews', icon: <Star className="w-4 h-4" /> },
    { name: 'Sales Reports', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Top Brand / Admin Header */}
      <div className="p-5 border-b border-zinc-800 bg-black flex flex-col gap-1">
        <Logo size="sm" isLink={false} />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-900">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
            CONTROL CENTER
          </span>
          <span className="px-1.5 py-0.5 bg-zinc-800 text-white text-[9px] font-bold">
            v1.0 (Django-Ready)
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors ${
                isActive
                  ? 'bg-white text-black font-extrabold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-black px-1.5 py-0.2 ${
                    isActive ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Switch to Public Storefront */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/40">
        <Link
          href="/"
          className="flex items-center justify-between p-2 text-xs font-bold text-zinc-300 hover:text-white bg-black border border-zinc-800 hover:border-zinc-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            <span>Customer Website</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        </Link>
      </div>
    </aside>
  );
};
