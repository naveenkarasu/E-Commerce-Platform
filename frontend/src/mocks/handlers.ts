import { http, HttpResponse, delay } from 'msw';
import { mockProducts, mockUsers, mockOrders } from './data';
import type { Product, Order, OrderItem } from '@/types';

let products = [...mockProducts];
let orders = [...mockOrders];
let nextProductId = 13;
let nextOrderId = 1005;

function getTokenFromRequest(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function getUserFromToken(token: string | null) {
  if (!token) return null;
  return mockUsers.find((u) => u.token === token) || null;
}

export const handlers = [
  // Auth endpoints
  http.post('*/api/v1/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { username: string; password: string };
    const user = mockUsers.find(
      (u) => u.username === body.username && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: user.token,
      username: user.username,
      role: user.role,
    });
  }),

  http.post('*/api/v1/auth/register', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { username: string; password: string; email: string };

    const exists = mockUsers.find((u) => u.username === body.username);
    if (exists) {
      return HttpResponse.json(
        { message: 'Username already exists' },
        { status: 400 }
      );
    }

    const newToken = `mock-jwt-token-${body.username}`;
    mockUsers.push({
      username: body.username,
      password: body.password,
      role: 'USER',
      token: newToken,
    });

    return HttpResponse.json({
      token: newToken,
      username: body.username,
      role: 'USER',
    });
  }),

  // Products endpoints
  http.get('*/api/v1/products', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let result = [...products];
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    return HttpResponse.json(result);
  }),

  http.get('*/api/v1/products/:id', async ({ params }) => {
    await delay(200);
    const id = Number(params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(product);
  }),

  http.post('*/api/v1/products', async ({ request }) => {
    await delay(300);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user || user.role !== 'ADMIN') {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = (await request.json()) as Omit<Product, 'id'>;
    const newProduct: Product = {
      ...body,
      id: nextProductId++,
    };
    products.push(newProduct);

    return HttpResponse.json(newProduct, { status: 201 });
  }),

  http.put('*/api/v1/products/:id', async ({ params, request }) => {
    await delay(300);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user || user.role !== 'ADMIN') {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const id = Number(params.id);
    const body = (await request.json()) as Omit<Product, 'id'>;
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    products[index] = { ...body, id };
    return HttpResponse.json(products[index]);
  }),

  http.delete('*/api/v1/products/:id', async ({ params, request }) => {
    await delay(300);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user || user.role !== 'ADMIN') {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const id = Number(params.id);
    products = products.filter((p) => p.id !== id);

    return new HttpResponse(null, { status: 204 });
  }),

  // Cart endpoints (in demo mode, cart is client-side via Zustand, but we still handle API calls)
  http.get('*/api/v1/cart', async () => {
    await delay(200);
    return HttpResponse.json({
      id: 1,
      items: [],
      totalPrice: 0,
    });
  }),

  http.post('*/api/v1/cart/add', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const productId = Number(url.searchParams.get('productId'));
    const quantity = Number(url.searchParams.get('quantity'));
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return HttpResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: 1,
      items: [{ id: 1, product, quantity }],
      totalPrice: product.price * quantity,
    });
  }),

  http.put('*/api/v1/cart/update', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const productId = Number(url.searchParams.get('productId'));
    const quantity = Number(url.searchParams.get('quantity'));
    const product = products.find((p) => p.id === productId);

    return HttpResponse.json({
      id: 1,
      items: product ? [{ id: 1, product, quantity }] : [],
      totalPrice: product ? product.price * quantity : 0,
    });
  }),

  http.delete('*/api/v1/cart/remove', async () => {
    await delay(200);
    return HttpResponse.json({
      id: 1,
      items: [],
      totalPrice: 0,
    });
  }),

  // Orders endpoints
  http.get('*/api/v1/orders', async ({ request }) => {
    await delay(300);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role === 'ADMIN') {
      return HttpResponse.json(orders);
    }

    return HttpResponse.json(orders);
  }),

  http.get('*/api/v1/orders/:id', async ({ params, request }) => {
    await delay(200);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = Number(params.id);
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return HttpResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(order);
  }),

  http.post('*/api/v1/orders/checkout', async ({ request }) => {
    await delay(500);
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);

    if (!user) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { shippingAddress: string };

    const newOrder: Order = {
      id: nextOrderId++,
      items: [
        {
          id: 1,
          productId: 1,
          productName: 'Demo Product',
          quantity: 1,
          price: 99.99,
        },
      ],
      totalPrice: 99.99,
      status: 'PENDING',
      shippingAddress: body.shippingAddress,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
];
