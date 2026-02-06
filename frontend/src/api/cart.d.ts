import type { Cart } from '@/types';
export declare const cartApi: {
    get: () => Promise<Cart>;
    addItem: (productId: number, quantity: number) => Promise<Cart>;
    updateItem: (productId: number, quantity: number) => Promise<Cart>;
    removeItem: (productId: number) => Promise<Cart>;
};
