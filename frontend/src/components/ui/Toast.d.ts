import type { Toast as ToastType } from '@/types';
interface ToastProps {
    toast: ToastType;
    onRemove: (id: string) => void;
}
declare function Toast({ toast, onRemove }: ToastProps): import("react/jsx-runtime").JSX.Element;
export { Toast };
