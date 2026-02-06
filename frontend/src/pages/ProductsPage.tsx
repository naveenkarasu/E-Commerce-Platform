import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductSearch } from '@/components/products/ProductSearch';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('');

  const { data: products, isLoading } = useProducts();

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    return result;
  }, [products, search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="mt-1 text-gray-500">
          Browse our full catalog of products
        </p>
      </div>

      <ProductSearch
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <ProductGrid products={filteredProducts} isLoading={isLoading} />
    </div>
  );
}
