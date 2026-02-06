import type { Product, Order, OrderStatus } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Pro Laptop 15"',
    description: 'High-performance laptop with 16GB RAM, 512GB SSD, and a stunning 15.6" Retina display. Perfect for development and creative work.',
    price: 1299.99,
    imageUrl: '/placeholder-laptop.jpg',
    category: 'Electronics',
    stockQuantity: 25,
  },
  {
    id: 2,
    name: 'SmartPhone X12',
    description: 'Latest flagship smartphone with 6.7" OLED display, triple camera system, and all-day battery life. 5G enabled.',
    price: 899.99,
    imageUrl: '/placeholder-phone.jpg',
    category: 'Electronics',
    stockQuantity: 50,
  },
  {
    id: 3,
    name: 'Wireless Headphones Pro',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life, spatial audio, and ultra-comfortable design.',
    price: 349.99,
    imageUrl: '/placeholder-headphones.jpg',
    category: 'Electronics',
    stockQuantity: 100,
  },
  {
    id: 4,
    name: 'Tablet Air 11"',
    description: 'Lightweight tablet with M2 chip, 11" Liquid Retina display, and support for stylus input. Great for artists and students.',
    price: 599.99,
    imageUrl: '/placeholder-tablet.jpg',
    category: 'Electronics',
    stockQuantity: 35,
  },
  {
    id: 5,
    name: 'SmartWatch Series 9',
    description: 'Advanced smartwatch with health monitoring, GPS, and a beautiful always-on display. Water resistant to 50m.',
    price: 449.99,
    imageUrl: '/placeholder-watch.jpg',
    category: 'Electronics',
    stockQuantity: 60,
  },
  {
    id: 6,
    name: 'Classic Cotton T-Shirt',
    description: 'Premium 100% organic cotton t-shirt. Soft, breathable, and available in multiple colors. Unisex regular fit.',
    price: 29.99,
    imageUrl: '/placeholder-tshirt.jpg',
    category: 'Clothing',
    stockQuantity: 200,
  },
  {
    id: 7,
    name: 'Slim Fit Denim Jeans',
    description: 'Classic slim-fit jeans made from premium stretch denim. Comfortable all-day wear with a modern silhouette.',
    price: 69.99,
    imageUrl: '/placeholder-jeans.jpg',
    category: 'Clothing',
    stockQuantity: 150,
  },
  {
    id: 8,
    name: 'Winter Puffer Jacket',
    description: 'Insulated puffer jacket with water-resistant shell. Keeps you warm in temperatures down to -20F. Packable design.',
    price: 189.99,
    imageUrl: '/placeholder-jacket.jpg',
    category: 'Clothing',
    stockQuantity: 75,
  },
  {
    id: 9,
    name: 'Running Sneakers Boost',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Great for daily runs and gym workouts.',
    price: 129.99,
    imageUrl: '/placeholder-sneakers.jpg',
    category: 'Clothing',
    stockQuantity: 120,
  },
  {
    id: 10,
    name: 'Learn TypeScript in Depth',
    description: 'Comprehensive guide to TypeScript from beginner to advanced. Covers generics, decorators, and real-world project patterns.',
    price: 49.99,
    imageUrl: '/placeholder-book1.jpg',
    category: 'Books',
    stockQuantity: 300,
  },
  {
    id: 11,
    name: 'The Midnight Library',
    description: 'A beautiful novel about the choices we make and the lives we could have lived. A thought-provoking bestseller.',
    price: 16.99,
    imageUrl: '/placeholder-book2.jpg',
    category: 'Books',
    stockQuantity: 250,
  },
  {
    id: 12,
    name: 'Data Structures & Algorithms',
    description: 'Essential textbook covering fundamental data structures and algorithms. Includes practice problems and solutions.',
    price: 79.99,
    imageUrl: '/placeholder-book3.jpg',
    category: 'Books',
    stockQuantity: 180,
  },
];

export const mockUsers = [
  {
    username: 'user1',
    password: 'password123',
    role: 'USER' as const,
    token: 'mock-jwt-token-user1',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN' as const,
    token: 'mock-jwt-token-admin',
  },
];

const orderStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export const mockOrders: Order[] = [
  {
    id: 1001,
    items: [
      { id: 1, productId: 1, productName: 'Pro Laptop 15"', quantity: 1, price: 1299.99 },
      { id: 2, productId: 3, productName: 'Wireless Headphones Pro', quantity: 1, price: 349.99 },
    ],
    totalPrice: 1649.98,
    status: 'DELIVERED',
    shippingAddress: '123 Main St, San Francisco, CA 94102',
    createdAt: '2024-12-15T10:30:00Z',
  },
  {
    id: 1002,
    items: [
      { id: 3, productId: 6, productName: 'Classic Cotton T-Shirt', quantity: 3, price: 29.99 },
      { id: 4, productId: 7, productName: 'Slim Fit Denim Jeans', quantity: 2, price: 69.99 },
    ],
    totalPrice: 229.95,
    status: 'SHIPPED',
    shippingAddress: '456 Oak Ave, New York, NY 10001',
    createdAt: '2025-01-10T14:20:00Z',
  },
  {
    id: 1003,
    items: [
      { id: 5, productId: 10, productName: 'Learn TypeScript in Depth', quantity: 1, price: 49.99 },
    ],
    totalPrice: 49.99,
    status: 'PROCESSING',
    shippingAddress: '789 Pine Rd, Austin, TX 73301',
    createdAt: '2025-01-25T09:15:00Z',
  },
  {
    id: 1004,
    items: [
      { id: 6, productId: 2, productName: 'SmartPhone X12', quantity: 1, price: 899.99 },
      { id: 7, productId: 5, productName: 'SmartWatch Series 9', quantity: 1, price: 449.99 },
    ],
    totalPrice: 1349.98,
    status: 'PENDING',
    shippingAddress: '321 Elm St, Seattle, WA 98101',
    createdAt: '2025-02-01T16:45:00Z',
  },
];

export { orderStatuses };
