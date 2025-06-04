import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute w-full h-full border-4 border-current border-solid rounded-full opacity-20"></div>
      <div className="absolute w-full h-full border-4 border-current border-solid rounded-full opacity-50 animate-spin border-t-transparent"></div>
    </div>
  );
}
