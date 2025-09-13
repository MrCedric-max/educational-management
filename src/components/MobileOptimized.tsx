import React from 'react';
import { getResponsiveClassName, MobileOptimizedProps, useResponsive } from '../utils/responsiveUtils';

interface MobileOptimizedComponentProps extends MobileOptimizedProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

// Mobile-optimized wrapper component
export const MobileOptimized: React.FC<MobileOptimizedComponentProps> = ({
  children,
  as: Component = 'div',
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  touchOptimized = false,
  ...props
}) => {
  const responsiveClassName = getResponsiveClassName({
    className,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    touchOptimized,
  });

  return (
    <Component className={responsiveClassName} {...props}>
      {children}
    </Component>
  );
};

// Mobile-optimized button component
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, MobileOptimizedProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  variant = 'primary',
  size = 'md',
  touchOptimized = true,
  ...props
}) => {
  const { isMobile } = useResponsive();
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };
  
  const baseClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    rounded-lg font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${touchOptimized ? 'min-h-[44px] min-w-[44px] touch-manipulation' : ''}
  `;
  
  const responsiveClassName = getResponsiveClassName({
    className: `${baseClasses} ${className}`,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    touchOptimized,
  });

  return (
    <button className={responsiveClassName} {...props}>
      {children}
    </button>
  );
};

// Mobile-optimized card component
interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement>, MobileOptimizedProps {
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  padding = 'md',
  shadow = 'sm',
  touchOptimized = false,
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 md:p-6 lg:p-8',
    lg: 'p-6 md:p-8 lg:p-10',
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  const baseClasses = `
    bg-white rounded-lg border border-gray-200
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
  `;
  
  const responsiveClassName = getResponsiveClassName({
    className: `${baseClasses} ${className}`,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    touchOptimized,
  });

  return (
    <div className={responsiveClassName} {...props}>
      {children}
    </div>
  );
};

// Mobile-optimized input component
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement>, MobileOptimizedProps {
  label?: string;
  error?: string;
  helperText?: string;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  error,
  helperText,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  touchOptimized = true,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
    ${touchOptimized ? 'min-h-[44px] touch-manipulation' : ''}
  `;
  
  const responsiveClassName = getResponsiveClassName({
    className: `${baseClasses} ${className}`,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    touchOptimized,
  });

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input className={responsiveClassName} {...props} />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Mobile-optimized grid component
interface MobileGridProps extends React.HTMLAttributes<HTMLDivElement>, MobileOptimizedProps {
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  touchOptimized = false,
  ...props
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4 md:gap-6 lg:gap-8',
    lg: 'gap-6 md:gap-8 lg:gap-10',
  };
  
  const gridCols = `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;
  
  const baseClasses = `
    grid ${gridCols} ${gapClasses[gap]}
  `;
  
  const responsiveClassName = getResponsiveClassName({
    className: `${baseClasses} ${className}`,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    touchOptimized,
  });

  return (
    <div className={responsiveClassName} {...props}>
      {children}
    </div>
  );
};

export default MobileOptimized;




