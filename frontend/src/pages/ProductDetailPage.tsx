import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductViewer3D } from '@/components/three/ProductViewer3D';
import { useProduct } from '@/hooks/useProducts';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id) || 0;
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Product not found</h2>
        <p className="mt-2 text-stone-500">The product you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductViewer3D product={product} />
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
