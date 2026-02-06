import apiClient from './client';
import type { Product, ProductFormData } from '@/types';

export const productsApi = {
  getAll: async (search?: string): Promise<Product[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get<Product[]>('/products', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: ProductFormData): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: ProductFormData): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
