import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'new' | 'bestseller' | 'price699' | 'discount' | 'stock' | 'dark' | 'outline';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'dark',
  children,
  className = '',
  size = 'md'
}) => {
  const base = 'inline-flex items-center font-bold uppercase tracking-wider select-none leading-none';

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-1'
  };

  const variants = {
    new: 'bg-white text-black border border-white font-extrabold',
    bestseller: 'bg-zinc-100 text-zinc-950 border border-zinc-200 font-extrabold',
    price699: 'bg-zinc-900 text-white border border-zinc-700 font-black tracking-widest',
    discount: 'bg-black text-white border border-zinc-600 font-bold',
    stock: 'bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold',
    dark: 'bg-zinc-900 text-zinc-300 border border-zinc-800',
    outline: 'bg-transparent text-zinc-300 border border-zinc-700'
  };

  return (
    <span className={twMerge(clsx(base, sizes[size], variants[variant], className))}>
      {children}
    </span>
  );
};
