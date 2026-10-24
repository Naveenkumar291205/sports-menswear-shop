import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase text-xs transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const variants = {
    primary: 'bg-white text-black hover:bg-zinc-200 border border-white shadow-md shadow-white/5',
    secondary: 'bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800',
    outline: 'bg-transparent text-white border border-zinc-700 hover:border-white hover:bg-white hover:text-black',
    white: 'bg-white text-black hover:bg-zinc-100 border border-white',
    ghost: 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600'
  };

  const sizes = {
    sm: 'h-9 px-3.5 py-1.5 text-[11px] gap-1.5',
    md: 'h-11 px-5 py-2.5 text-xs gap-2',
    lg: 'h-13 px-8 py-3.5 text-sm gap-2.5',
    xl: 'h-14 px-10 py-4 text-sm font-black tracking-widest gap-3',
    icon: 'h-10 w-10 p-0 flex items-center justify-center'
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
