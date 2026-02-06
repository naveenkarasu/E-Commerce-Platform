import apiClient from './client';
import type { Cart } from '@/types';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  addItem: async (productId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/add', null, {
      params: { productId, quantity },
    });
    return response.data;
  },

  updateItem: async (productId: number, quantity: number): Promise<Cart> => {
    const response = await apiClient.put<Cart>('/cart/update', null, {
      params: { productId, quantity },
    });
    return response.data;
  },

  removeItem: async (productId: number): Promise<Cart> => {
    const response = await apiClient.delete<Cart>('/cart/remove', {
      params: { productId },
    });
    return response.data;
  },
};
