import type { CheckoutRequest } from '@/types';
export declare function useOrders(): import("@tanstack/react-query").UseQueryResult<import("@/types").Order[], Error>;
export declare function useOrder(id: number): import("@tanstack/react-query").UseQueryResult<import("@/types").Order, Error>;
export declare function useCheckout(): import("@tanstack/react-query").UseMutationResult<import("@/types").Order, Error, CheckoutRequest, unknown>;
