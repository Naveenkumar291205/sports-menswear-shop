import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  isLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  className = '',
  isLink = true
}) => {
  const sizeClasses = {
    sm: 'text-base tracking-wider',
    md: 'text-lg sm:text-xl tracking-wider',
    lg: 'text-xl sm:text-2xl tracking-wider',
    xl: 'text-2xl sm:text-3xl tracking-wider'
  };

  const markSizes = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-9 h-9 text-sm',
    xl: 'w-11 h-11 text-base'
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Geometric SMW Icon Mark */}
      <div className={`relative flex items-center justify-center bg-white text-black font-black italic rounded-none border border-white/20 shadow-glow flex-shrink-0 ${markSizes[size]}`}>
        <span className="font-black tracking-tighter leading-none pr-0.5">S</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-black" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black uppercase tracking-wider text-white font-sans ${sizeClasses[size]}`}>
            SPORTS
          </span>
          <span className={`font-light uppercase tracking-wider text-zinc-300 font-sans ${sizeClasses[size]}`}>
            MENS WEAR
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium mt-1">
            BUILT FOR MOVEMENT • PERFORMANCE WEAR
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="group transition-opacity hover:opacity-95 flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

