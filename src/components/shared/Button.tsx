import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-medium rounded-lg border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    />
  );
}
