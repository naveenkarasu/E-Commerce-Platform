import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useOrders';
import { useToastStore } from '@/hooks/useToast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const addToast = useToastStore((s) => s.addToast);
  const checkout = useCheckout();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const totalPrice = getTotalPrice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const shippingAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

    try {
      await checkout.mutateAsync({ shippingAddress });
      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch {
      addToast('Failed to place order. Please try again.', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-950">Your cart is empty</h2>
        <p className="mt-2 text-navy-500">Add some items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy-950 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-navy-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-navy-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-navy-700 mb-1">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="San Francisco"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-navy-700 mb-1">
                      State
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-navy-700 mb-1">
                      ZIP Code
                    </label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      placeholder="94102"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-navy-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-navy-950">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-navy-100 pt-4">
                <div className="flex justify-between text-sm text-navy-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-navy-100 pt-4">
                <div className="flex justify-between font-semibold text-navy-950">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <Button
                type="submit"
                form="checkout-form"
                className="w-full gap-2"
                size="lg"
                disabled={checkout.isPending}
              >
                <CreditCard className="h-5 w-5" />
                {checkout.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
