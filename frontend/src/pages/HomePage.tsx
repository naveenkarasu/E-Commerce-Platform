import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { HeroScene } from '@/components/three/HeroScene';
import { CategoryShowcase } from '@/components/three/CategoryShowcase';

export default function HomePage() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 8) ?? [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 text-white overflow-hidden">
        <HeroScene />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Discover Quality Products
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 leading-relaxed">
              Shop the latest electronics, clothing, and books. Premium quality at great prices with fast, free shipping.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 gap-2">
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-navy-100 bg-primary-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <CategoryShowcase />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Free Shipping</h3>
                <p className="text-sm text-navy-500">On all orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Secure Payment</h3>
                <p className="text-sm text-navy-500">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-navy-950">Quality Products</h3>
                <p className="text-sm text-navy-500">Curated selection of top brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-950">Featured Products</h2>
            <p className="mt-1 text-navy-500">Handpicked items just for you</p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} isLoading={isLoading} />
      </section>
    </div>
  );
}
