# Project Index: E-Commerce Platform

Generated: 2026-02-06

## Project Structure

```
ecommerce-platform/
├── pom.xml                          # Spring Boot 3.2.5 (Java 17)
├── Dockerfile                       # Backend Docker (temurin:17)
├── docker-compose.yml               # MySQL + Backend + Frontend
├── README.md
├── src/main/java/com/ecommerce/
│   ├── ECommerceApplication.java    # Entry point
│   ├── config/
│   │   ├── SecurityConfig.java      # Spring Security + CORS + form login
│   │   └── OpenApiConfig.java       # Swagger/OpenAPI 3.0
│   ├── controller/
│   │   ├── AuthController.java      # /api/v1/auth/**
│   │   ├── ProductController.java   # /api/v1/products/**
│   │   ├── CartController.java      # /api/v1/cart/**
│   │   └── OrderController.java     # /api/v1/orders/**
│   ├── model/
│   │   ├── User.java                # userId, email, name, password, role
│   │   ├── Product.java             # productId, name, price, stockQuantity, category
│   │   ├── Cart.java                # cartId, user, items
│   │   ├── CartItem.java            # cartItemId, cart, product, quantity
│   │   └── Order.java               # orderId, user, items, total, status, address
│   ├── repository/                  # Spring Data JPA interfaces
│   ├── service/
│   │   ├── UserService.java         # Auth, registration, BCrypt
│   │   ├── ProductService.java      # CRUD, search, category filter
│   │   ├── CartService.java         # Add/remove items, get/create cart
│   │   └── OrderService.java        # Place order, status updates, history
│   └── dto/                         # Request/Response DTOs
├── src/main/resources/
│   ├── application.properties       # Port 8080, MySQL, Flyway
│   └── db/migration/
│       ├── V1__initial_schema.sql   # DDL: users, products, carts, orders
│       └── V2__seed_data.sql        # Sample products, admin user
├── src/test/java/com/ecommerce/
│   ├── controller/
│   │   └── AuthControllerTest.java  # @WebMvcTest + @Import(SecurityConfig)
│   └── service/
│       ├── UserServiceTest.java
│       ├── ProductServiceTest.java
│       ├── CartServiceTest.java
│       └── OrderServiceTest.java
├── frontend/
│   ├── package.json                 # React 18.3.1, Vite 5.4.21
│   ├── vite.config.ts              # base: '/E-Commerce-Platform/'
│   ├── tailwind.config.js          # Sunset orange + navy palette
│   ├── Dockerfile                   # Node 20 + Nginx
│   ├── nginx.conf                   # Proxy /api/ -> backend:8080
│   ├── public/mockServiceWorker.js  # MSW service worker
│   └── src/
│       ├── main.tsx                 # React + QueryClient + MSW demo mode
│       ├── App.tsx                  # Routes + Layout
│       ├── pages/
│       │   ├── HomePage.tsx         # Hero + HeroScene 3D + featured products
│       │   ├── LoginPage.tsx        # Auth form
│       │   ├── RegisterPage.tsx
│       │   ├── ProductsPage.tsx     # Product grid + search + filters
│       │   ├── ProductDetailPage.tsx # Single product + 3D viewer
│       │   ├── CartPage.tsx         # Shopping cart
│       │   ├── CheckoutPage.tsx     # Order placement
│       │   ├── OrderHistoryPage.tsx
│       │   ├── OrderDetailPage.tsx
│       │   ├── AdminPage.tsx        # Admin dashboard
│       │   ├── AdminProductsPage.tsx # Product CRUD
│       │   └── AdminOrdersPage.tsx  # Order management
│       ├── components/
│       │   ├── layout/              # Navbar, Footer, Layout
│       │   ├── products/            # ProductGrid, ProductCard
│       │   ├── three/               # HeroScene, CategoryShowcase, ProductViewer3D
│       │   └── ui/                  # Button, Input, Card, Dialog, Badge, Toast
│       ├── hooks/
│       │   ├── useAuth.ts           # Zustand auth store
│       │   ├── useProducts.ts       # TanStack Query hooks
│       │   ├── useCart.ts
│       │   └── useOrders.ts
│       ├── api/
│       │   ├── client.ts            # Axios + JWT interceptor
│       │   ├── auth.ts              # login, register
│       │   ├── products.ts          # CRUD
│       │   ├── cart.ts
│       │   └── orders.ts
│       ├── mocks/
│       │   ├── browser.ts           # MSW setup
│       │   ├── handlers.ts          # API route handlers
│       │   └── data.ts              # Mock products, users
│       └── types/index.ts           # TypeScript interfaces
└── .github/workflows/
    └── deploy-frontend.yml          # GitHub Pages deployment
```

## Entry Points

- **Backend**: `src/main/java/com/ecommerce/ECommerceApplication.java` - Spring Boot main (port 8080)
- **Frontend**: `frontend/src/main.tsx` - React app with MSW demo mode
- **Docker**: `docker-compose.yml` - MySQL (3306) + Backend (8080) + Frontend (3000)

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/auth/register | Public | Register user |
| POST | /api/v1/auth/login | Public | Login |
| GET | /api/v1/products | Public | List/search products |
| GET | /api/v1/products/{id} | Public | Get product |
| POST | /api/v1/products | Admin | Create product |
| PUT | /api/v1/products/{id} | Admin | Update product |
| DELETE | /api/v1/products/{id} | Admin | Delete product |
| GET | /api/v1/cart | Auth | Get cart |
| POST | /api/v1/cart/items | Auth | Add to cart |
| DELETE | /api/v1/cart/items/{id} | Auth | Remove from cart |
| POST | /api/v1/orders | Auth | Place order |
| GET | /api/v1/orders | Auth | Order history |
| GET | /api/v1/orders/{id} | Auth | Order detail |
| GET | /api/v1/orders/all | Admin | All orders |
| PUT | /api/v1/orders/{id}/status | Admin | Update status |

## Key Dependencies

### Backend
| Dependency | Version | Purpose |
|-----------|---------|---------|
| spring-boot-starter-web | 3.2.5 | REST API |
| spring-boot-starter-data-jpa | 3.2.5 | ORM |
| spring-boot-starter-security | 3.2.5 | Authentication |
| springdoc-openapi-starter-webmvc-ui | 2.3.0 | Swagger |
| flyway-core + flyway-mysql | auto | Migrations |
| mysql-connector-j | auto | MySQL driver |
| jjwt-api/impl/jackson | 0.12.5 | JWT |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| react-router-dom | 6.28.0 | Routing |
| @tanstack/react-query | 5.62.2 | Server state |
| zustand | 5.0.2 | Client state (auth, cart) |
| axios | 1.7.9 | HTTP client |
| three | 0.170.0 | 3D graphics |
| @react-three/fiber + drei | 8.x/9.x | React Three.js |
| tailwindcss | 3.4.16 | CSS framework |
| msw | 2.6.8 | API mocking |

## Tests

- **61 tests total** (all passing)
- `AuthControllerTest` - 8 tests (@WebMvcTest + @Import(SecurityConfig))
- `UserServiceTest` - Unit tests with Mockito
- `ProductServiceTest` - CRUD + search
- `CartServiceTest` - Cart operations
- `OrderServiceTest` - Order placement + status

## Build Commands

```bash
# Backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 mvn clean package

# Frontend
cd frontend && npm ci && npm run build

# Docker
docker-compose up -d
```

## Demo Mode

GitHub Pages deployment with MSW intercepting all `/api/v1/*` requests.
- `VITE_DEMO_MODE=true` enables MSW
- `mockServiceWorker.js` served from `{BASE_URL}mockServiceWorker.js`
- Mock data: 12 products, demo admin/customer accounts
