import { getContrastColor } from '../../utils/colorUtils';

interface ColorSwatchProps {
  hex: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function ColorSwatch({ hex, size = 'md', className = '' }: ColorSwatchProps) {
  const borderColor = getContrastColor(hex) === '#000000' ? '#d1d5db' : 'transparent';
  return (
    <span
      className={`inline-block rounded-full border ${sizeMap[size]} ${className}`}
      style={{ backgroundColor: hex, borderColor }}
      aria-hidden="true"
    />
  );
}
