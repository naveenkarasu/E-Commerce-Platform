import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types';
export declare const authApi: {
    login: (data: LoginRequest) => Promise<AuthResponse>;
    register: (data: RegisterRequest) => Promise<AuthResponse>;
};
