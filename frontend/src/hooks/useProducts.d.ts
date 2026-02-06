import type { ProductFormData } from '@/types';
export declare function useProducts(search?: string): import("@tanstack/react-query").UseQueryResult<import("@/types").Product[], Error>;
export declare function useProduct(id: number): import("@tanstack/react-query").UseQueryResult<import("@/types").Product, Error>;
export declare function useCreateProduct(): import("@tanstack/react-query").UseMutationResult<import("@/types").Product, Error, ProductFormData, unknown>;
export declare function useUpdateProduct(): import("@tanstack/react-query").UseMutationResult<import("@/types").Product, Error, {
    id: number;
    data: ProductFormData;
}, unknown>;
export declare function useDeleteProduct(): import("@tanstack/react-query").UseMutationResult<void, Error, number, unknown>;
