import type { Product, CartItem } from '@/types';
interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotalPrice: () => number;
}
export declare const useCartStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CartState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CartState, CartState>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CartState) => void) => () => void;
        onFinishHydration: (fn: (state: CartState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CartState, CartState>>;
    };
}>;
export {};
