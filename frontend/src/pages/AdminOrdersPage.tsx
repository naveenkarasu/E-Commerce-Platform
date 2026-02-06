import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import type { OrderStatus } from '@/types';

const statusVariants: Record<OrderStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  PENDING: 'warning',
  PROCESSING: 'default',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Orders</h1>
        <p className="mt-1 text-stone-500">Manage customer orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Orders ({orders?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-500">Shipping</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr key={order.id} className="border-b border-stone-200 hover:bg-amber-50">
                      <td className="py-3 px-4 font-medium text-stone-900">#{order.id}</td>
                      <td className="py-3 px-4 text-stone-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-900">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                        {order.shippingAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
