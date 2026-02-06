import type { Product, ProductFormData } from '@/types';
export declare const productsApi: {
    getAll: (search?: string) => Promise<Product[]>;
    getById: (id: number) => Promise<Product>;
    create: (data: ProductFormData) => Promise<Product>;
    update: (id: number, data: ProductFormData) => Promise<Product>;
    delete: (id: number) => Promise<void>;
};
