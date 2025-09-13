// Responsive design utilities for mobile optimization
import React from 'react';

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Check if current screen size matches breakpoint
export const isBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

// Check if screen is mobile (below lg breakpoint)
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.lg;
};

// Check if screen is tablet (md to lg)
export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
};

// Check if screen is desktop (lg and above)
export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

// Get responsive classes based on screen size
export const getResponsiveClasses = (config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const classes = [];
  
  if (config.mobile) classes.push(config.mobile);
  if (config.tablet) classes.push(`md:${config.tablet}`);
  if (config.desktop) classes.push(`lg:${config.desktop}`);
  
  return classes.join(' ');
};

// Touch interaction utilities
export const touchClasses = {
  // Touch-friendly button sizing
  button: 'min-h-[44px] min-w-[44px] touch-manipulation',
  // Touch-friendly input sizing
  input: 'min-h-[44px] touch-manipulation',
  // Touch-friendly link sizing
  link: 'min-h-[44px] min-w-[44px] touch-manipulation',
  // Touch-friendly icon sizing
  icon: 'w-6 h-6',
  // Touch-friendly spacing
  spacing: 'p-3',
  // Touch-friendly margins
  margin: 'm-2',
};

// Mobile-specific component configurations
export const mobileConfig = {
  // Grid configurations for different screen sizes
  grid: {
    mobile: 'grid-cols-1 gap-4',
    tablet: 'md:grid-cols-2 md:gap-6',
    desktop: 'lg:grid-cols-3 lg:gap-8',
  },
  // Card configurations
  card: {
    mobile: 'p-4 rounded-lg shadow-sm',
    tablet: 'md:p-6 md:rounded-xl md:shadow-md',
    desktop: 'lg:p-8 lg:rounded-2xl lg:shadow-lg',
  },
  // Text sizing
  text: {
    mobile: 'text-sm',
    tablet: 'md:text-base',
    desktop: 'lg:text-lg',
  },
  // Button sizing
  button: {
    mobile: 'px-4 py-2 text-sm',
    tablet: 'md:px-6 md:py-3 md:text-base',
    desktop: 'lg:px-8 lg:py-4 lg:text-lg',
  },
};

// Hook for responsive behavior
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const updateScreenSize = () => {
      if (isMobile()) {
        setScreenSize('mobile');
      } else if (isTablet()) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);
  
  return {
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
  };
};

// Mobile-optimized component props
export interface MobileOptimizedProps {
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  touchOptimized?: boolean;
}

// Generate responsive className
export const getResponsiveClassName = (props: MobileOptimizedProps): string => {
  const classes = [props.className];
  
  if (props.mobileClassName) classes.push(props.mobileClassName);
  if (props.tabletClassName) classes.push(`md:${props.tabletClassName}`);
  if (props.desktopClassName) classes.push(`lg:${props.desktopClassName}`);
  
  if (props.touchOptimized) {
    classes.push(touchClasses.button);
  }
  
  return classes.filter(Boolean).join(' ');
};

// Mobile gesture utilities
export const mobileGestures = {
  // Swipe detection
  onSwipe: (callback: (direction: 'left' | 'right' | 'up' | 'down') => void) => {
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      const threshold = 50; // Minimum swipe distance
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          callback(diffX > 0 ? 'left' : 'right');
        }
      } else {
        if (Math.abs(diffY) > threshold) {
          callback(diffY > 0 ? 'up' : 'down');
        }
      }
    };
    
    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    };
  },
};

