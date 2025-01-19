import { apiClient } from './client';
import { CartItem, SavedPaymentMethods } from '@/types/checkout';
import { handleApiError, handleNetworkError } from '@/utils/error-handlers';

export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    return await apiClient.get<CartItem[]>('/api/cart');
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const fetchPaymentMethods = async (): Promise<SavedPaymentMethods> => {
  try {
    return await apiClient.get<SavedPaymentMethods>('/api/payment-methods');
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const fetchAddressByPostalCode = async (postalCode: string) => {
  try {
    return await apiClient.get(`https://api.zipaddress.net/?zipcode=${postalCode}`);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const savePaymentMethod = async (data: any) => {
  try {
    return await apiClient.post('/api/payment-methods', data);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  try {
    return await apiClient.patch(`/api/cart/${itemId}`, { quantity });
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    return await apiClient.delete(`/api/cart/${itemId}`);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};

export const submitOrder = async (orderData: any) => {
  try {
    return await apiClient.post('/api/orders', orderData);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    handleApiError(error);
  }
};