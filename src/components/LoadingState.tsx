import React from 'react';

type LoadingStateProps = {
  message?: string;
  size?: 'small' | 'medium' | 'large';
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <div
        className={`animate-spin rounded-full border-t-primary-600 border-r-transparent border-b-primary-600 border-l-transparent ${sizeClasses[size]}`}
        role="status"
        aria-label="loading"
      />
      {message && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};