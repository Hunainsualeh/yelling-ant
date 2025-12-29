import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'default' | 'active';
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Badge = ({ children, icon, variant = 'default', color = 'bg-purple-600', className = '', onClick }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer';
  
  if (variant === 'active') {
    return (
      <button
        className={`${baseStyles} ${color} text-white border-0 ${className}`}
        onClick={onClick}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${baseStyles} bg-white border-2 text-gray-700 ${className}`}
      onClick={onClick}
      style={{
        borderColor: '#d1d5db',
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget;
        btn.style.borderColor = getColorValue(color || 'bg-purple-600');
        btn.style.backgroundColor = getColorValue(color || 'bg-purple-600');
        btn.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget;
        btn.style.borderColor = '#d1d5db';
        btn.style.backgroundColor = 'white';
        btn.style.color = '#374151';
      }}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};

const getColorValue = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    'bg-purple-600': '#9333ea',
    'bg-pink-500': '#ec4899',
    'bg-blue-500': '#3b82f6',
    'bg-yellow-500': '#eab308',
    'bg-green-500': '#22c55e',
    'bg-pink-400': '#f472b6',
    'bg-orange-500': '#f97316',
    'bg-cyan-500': '#06b6d4',
  };
  return colorMap[colorClass] || '#9333ea';
};

export default Badge;
