export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stockQuantity: number;
}
export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}
export interface Cart {
    id: number;
    items: CartItem[];
    totalPrice: number;
}
export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export interface Order {
    id: number;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: string;
}
export interface User {
    username: string;
    role: 'USER' | 'ADMIN';
    token: string;
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}
export interface AuthResponse {
    token: string;
    username: string;
    role: 'USER' | 'ADMIN';
}
export interface CheckoutRequest {
    shippingAddress: string;
}
export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    stockQuantity: number;
}
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}
