import type { Product, Order, OrderStatus } from '@/types';
export declare const mockProducts: Product[];
export declare const mockUsers: ({
    username: string;
    password: string;
    role: "USER";
    token: string;
} | {
    username: string;
    password: string;
    role: "ADMIN";
    token: string;
})[];
declare const orderStatuses: OrderStatus[];
export declare const mockOrders: Order[];
export { orderStatuses };
