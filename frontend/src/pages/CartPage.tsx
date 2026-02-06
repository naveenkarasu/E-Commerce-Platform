import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CartItemRow } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCartStore } from '@/hooks/useCart';
import { EmptyCartScene } from '@/components/three/EmptyCartScene';

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <EmptyCartScene />
          <h2 className="text-2xl font-bold text-navy-950 mt-4">Your cart is empty</h2>
          <p className="mt-2 text-navy-500 max-w-md">
            Looks like you have not added any items to your cart yet. Browse our products and find something you love.
          </p>
          <Link to="/products" className="mt-6">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy-950 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
