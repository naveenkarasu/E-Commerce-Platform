import type { Toast } from '@/types';
interface ToastStore {
    toasts: Toast[];
    addToast: (message: string, type: Toast['type']) => void;
    removeToast: (id: string) => void;
}
export declare const useToastStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ToastStore>>;
export {};
