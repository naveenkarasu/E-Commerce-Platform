import apiClient from './client';
import type { Order, CheckoutRequest } from '@/types';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  checkout: async (data: CheckoutRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders/checkout', data);
    return response.data;
  },
};
