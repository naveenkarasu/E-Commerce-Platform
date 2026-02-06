import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
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

export default function OrderHistoryPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-navy-950 mb-8">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-100 mb-6">
            <Package className="h-10 w-10 text-navy-400" />
          </div>
          <h2 className="text-2xl font-bold text-navy-950">No orders yet</h2>
          <p className="mt-2 text-navy-500">When you place an order, it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy-950 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-navy-950">Order #{order.id}</h3>
                      <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-navy-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-navy-500 mt-1">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-navy-950">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
