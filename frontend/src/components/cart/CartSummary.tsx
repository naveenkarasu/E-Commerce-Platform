import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const totalPrice = getTotalPrice();
  const itemCount = getItemCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items ({itemCount})</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </div>
        <Link to="/checkout" className="block">
          <Button className="w-full gap-2" size="lg" disabled={items.length === 0}>
            <ShoppingBag className="h-5 w-5" />
            Proceed to Checkout
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
