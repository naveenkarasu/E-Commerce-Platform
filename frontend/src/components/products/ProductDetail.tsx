import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';
import { useToastStore } from '@/hooks/useToast';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return;
    addItem(product, quantity);
    addToast(`${quantity}x ${product.name} added to cart`, 'success');
  };

  const incrementQty = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div>
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <Badge variant="warning">Only {product.stockQuantity} left</Badge>
            )}
            {product.stockQuantity === 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>
        </div>

        <div className="text-3xl font-bold text-primary-600">
          {formatPrice(product.price)}
        </div>

        <p className="text-stone-600 text-lg leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-stone-500">
          <Package className="h-4 w-4" />
          <span>{product.stockQuantity} units in stock</span>
        </div>

        {/* Quantity selector and Add to Cart */}
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center border border-stone-300 rounded-md">
            <button
              onClick={decrementQty}
              disabled={quantity <= 1}
              className="p-2 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQty}
              disabled={quantity >= product.stockQuantity}
              className="p-2 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="gap-2 flex-1 max-w-xs"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>

        <div className="text-sm text-stone-400 pt-2">
          Subtotal: {formatPrice(product.price * quantity)}
        </div>
      </div>
    </div>
  );
}
