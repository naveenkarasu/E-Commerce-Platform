import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCart';
import { useToastStore } from '@/hooks/useToast';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const categoryGradients: Record<string, string> = {
  Electronics: 'from-blue-400 to-indigo-600',
  Clothing: 'from-pink-400 to-rose-600',
  Books: 'from-amber-400 to-orange-600',
};

const categoryIcons: Record<string, string> = {
  Electronics: '🔌',
  Clothing: '👕',
  Books: '📚',
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQuantity <= 0) return;
    addItem(product, 1);
    addToast(`${product.name} added to cart`, 'success');
  };

  const gradient = categoryGradients[product.category] || 'from-gray-400 to-gray-600';

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Product image placeholder */}
        <div className={`relative aspect-square bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
            {categoryIcons[product.category] || '📦'}
          </span>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-stone-700">
              {product.category}
            </Badge>
          </div>
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning">Low Stock</Badge>
            </div>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-base px-4 py-1">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-stone-900 group-hover:text-primary-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-stone-900">{formatPrice(product.price)}</span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-stone-400">
            <Package className="h-3 w-3" />
            <span>{product.stockQuantity} in stock</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
