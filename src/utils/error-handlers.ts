import { APIError, ErrorResponse, isErrorResponse } from '@/types/error';
import toast from 'react-hot-toast';

export const handleApiError = (error: unknown): never => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        toast.error('ログインが必要です');
        throw error;
      case 403:
        toast.error('権限がありません');
        throw error;
      case 404:
        toast.error('データが見つかりませんでした');
        throw error;
      case 422:
        toast.error('入力内容に誤りがあります');
        throw error;
      case 429:
        toast.error('リクエストが多すぎます。しばらく待ってから再試行してください');
        throw error;
      case 500:
        toast.error('サーバーエラーが発生しました');
        throw error;
      default:
        toast.error('エラーが発生しました');
        throw error;
    }
  }

  if (isErrorResponse(error)) {
    toast.error(error.message);
    throw new Error(error.message);
  }

  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  }

  toast.error('予期せぬエラーが発生しました');
  throw new Error('Unknown error occurred');
};

export const handleNetworkError = (error: unknown): never => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast.error('ネットワークエラーが発生しました。インターネット接続を確認してください');
    throw new Error('Network error occurred');
  }
  throw error;
};

export const handleValidationError = (errors: Record<string, string[]>): void => {
  const messages = Object.values(errors).flat();
  messages.forEach(message => toast.error(message));
};