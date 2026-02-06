import type { Order, CheckoutRequest } from '@/types';
export declare const ordersApi: {
    getAll: () => Promise<Order[]>;
    getById: (id: number) => Promise<Order>;
    checkout: (data: CheckoutRequest) => Promise<Order>;
};
