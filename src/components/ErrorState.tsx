import React from 'react';
import { AlertTriangle } from 'lucide-react';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'エラーが発生しました',
  message = '申し訳ありませんが、問題が発生しました。もう一度お試しください。',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          再試行
        </button>
      )}
    </div>
  );
};