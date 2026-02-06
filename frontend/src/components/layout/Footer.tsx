import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ShopHub</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-md">
              Your one-stop shop for electronics, clothing, and books. Quality products at great prices with fast shipping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-gray-500 hover:text-gray-700">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?search=Electronics" className="text-sm text-gray-500 hover:text-gray-700">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?search=Clothing" className="text-sm text-gray-500 hover:text-gray-700">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?search=Books" className="text-sm text-gray-500 hover:text-gray-700">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 hover:text-gray-700">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-700">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-500 hover:text-gray-700">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
