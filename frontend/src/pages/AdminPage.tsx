import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { SalesChart3D } from '@/components/three/SalesChart3D';

export default function AdminPage() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const isLoading = productsLoading || ordersLoading;

  const totalProducts = products?.length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + o.totalPrice, 0) ?? 0;
  const pendingOrders = orders?.filter((o) => o.status === 'PENDING').length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-950">Admin Dashboard</h1>
        <p className="mt-1 text-navy-500">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-100">
                  <Package className="h-6 w-6 text-navy-600" />
                </div>
                <div>
                  <p className="text-sm text-navy-500">Total Products</p>
                  <p className="text-2xl font-bold text-navy-950">{totalProducts}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <ShoppingBag className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-navy-500">Total Orders</p>
                  <p className="text-2xl font-bold text-navy-950">{totalOrders}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-navy-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-navy-950">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-navy-500">Pending Orders</p>
                  <p className="text-2xl font-bold text-navy-950">{pendingOrders}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      {!isLoading && orders && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy-950 mb-3">Orders by Status</h2>
          <SalesChart3D data={{
            pending: orders.filter(o => o.status === 'PENDING').length,
            processing: orders.filter(o => o.status === 'PROCESSING').length,
            shipped: orders.filter(o => o.status === 'SHIPPED').length,
            delivered: orders.filter(o => o.status === 'DELIVERED').length,
          }} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-navy-500 mb-4">
              Manage your product catalog. Add, edit, or remove products.
            </p>
            <Link to="/admin/products">
              <Button>Manage Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-navy-500 mb-4">
              View and manage customer orders. Update order statuses.
            </p>
            <Link to="/admin/orders">
              <Button>Manage Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
