import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

const categoryGradients: Record<string, string> = {
  Electronics: 'from-blue-400 to-indigo-600',
  Clothing: 'from-pink-400 to-rose-600',
  Books: 'from-amber-400 to-orange-600',
};

export function CartItemRow({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const gradient = categoryGradients[item.product.category] || 'from-gray-400 to-gray-600';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-200 last:border-0">
      {/* Product image placeholder */}
      <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
        <span className="text-2xl">
          {item.product.category === 'Electronics' ? '🔌' :
           item.product.category === 'Clothing' ? '👕' :
           item.product.category === 'Books' ? '📚' : '📦'}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-stone-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-stone-500">{item.product.category}</p>
        <p className="text-sm font-semibold text-stone-900 mt-1">
          {formatPrice(item.product.price)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-stone-300 rounded-md">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="p-1.5 hover:bg-amber-50"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stockQuantity}
            className="p-1.5 hover:bg-amber-50 disabled:opacity-50"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.product.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Item total */}
      <div className="text-right shrink-0 w-24">
        <p className="font-semibold text-stone-900">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
