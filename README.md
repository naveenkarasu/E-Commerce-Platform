# E-Commerce Platform

A full-stack online shopping platform with product browsing, cart management, secure checkout, and order tracking. Features a modern React frontend with 3D product visualization, a Spring Boot REST API with Swagger documentation, and an admin panel for inventory and order management.

**[Live Demo](https://naveenkarasu.github.io/E-Commerce-Platform/)** (runs with mock data, no backend required)

## Tech Stack

### Backend
- **Java 17**, Spring Boot 3.2.5, Spring Data JPA, Spring Security 6
- **REST API** with versioned endpoints (`/api/v1/`)
- **Swagger/OpenAPI** documentation (`/swagger-ui.html`)
- **Database:** MySQL 8.0 with Flyway migrations
- **Email:** Spring Boot Starter Mail (order confirmations)
- **Testing:** JUnit 5, Mockito
- **Build Tool:** Apache Maven

### Frontend
- **React 18** with TypeScript 5
- **Vite 5** for fast builds and HMR
- **Tailwind CSS** + shadcn/ui components
- **Three.js** (React Three Fiber + Drei) - 3D product viewer
- **TanStack Query v5** for server state management
- **Zustand** for client state (auth, cart)
- **MSW** (Mock Service Worker) for demo mode
- **Axios** with JWT interceptors

## Quick Start with Docker

```bash
docker-compose up --build
```

This starts MySQL, the Spring Boot backend (port 8080), and the React frontend (port 3000).

Open: `http://localhost:3000`

## Manual Setup

### Prerequisites

- JDK 17
- Node.js 20+
- Apache Maven 3.x
- MySQL Server 8.0+

### Backend

```bash
# Database is auto-created by Flyway migrations
# Update credentials in src/main/resources/application.properties if needed

mvn spring-boot:run
```

Backend runs at `http://localhost:8080`
Swagger UI at `http://localhost:8080/swagger-ui.html`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Default Credentials

| Role     | Email              | Password     |
|----------|--------------------|--------------|
| Admin    | admin@shop.com     | admin123     |
| Customer | customer@gmail.com | customer123  |

## Features

- **Product Catalog** - Browse products by category, search by name
- **3D Product Viewer** - Interactive Three.js product visualization with rotation controls
- **User Registration & Login** - JWT-based stateless authentication
- **Shopping Cart** - Persistent cart with Zustand + localStorage
- **Checkout** - Place orders with shipping address
- **Order Tracking** - View order history and status
- **Email Notifications** - Order confirmation emails
- **Admin Panel** - Manage products, view/update orders, inventory management
- **Demo Mode** - Full frontend experience with MSW mock data (for GitHub Pages)

## REST API Endpoints

| Method | URL                     | Description            |
|--------|-------------------------|------------------------|
| POST   | /api/v1/auth/login      | Authenticate user      |
| POST   | /api/v1/auth/register   | Register new user      |
| GET    | /api/v1/products        | List all products      |
| GET    | /api/v1/products/{id}   | Get product details    |
| GET    | /api/v1/products/search | Search products        |
| GET    | /api/v1/cart            | Get cart contents      |
| POST   | /api/v1/cart/add        | Add item to cart       |
| DELETE | /api/v1/cart/remove/{id}| Remove item from cart  |
| GET    | /api/v1/orders          | Get order history      |
| POST   | /api/v1/orders          | Place new order        |
| GET    | /api/v1/orders/{id}     | Get order details      |
| PUT    | /api/v1/orders/{id}/status | Update order status |

Full API docs available at `/swagger-ui.html` when the backend is running.

## Project Structure

```
ecommerce-platform/
├── pom.xml
├── Dockerfile
├── docker-compose.yml
├── src/main/
│   ├── java/com/ecommerce/
│   │   ├── config/          # Security, OpenAPI, CORS config
│   │   ├── controller/      # Thymeleaf controllers (legacy)
│   │   ├── controller/api/  # REST API controllers
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── service/         # Business logic
│   │   └── dto/             # Data Transfer Objects
│   └── resources/
│       ├── application.properties
│       ├── db/migration/    # Flyway SQL migrations
│       └── templates/       # Thymeleaf templates
├── src/test/                # JUnit 5 tests
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── Dockerfile           # Nginx-based production container
    └── src/
        ├── components/      # React components + Three.js viewer
        ├── pages/           # Route pages
        ├── hooks/           # Custom hooks (auth, products, cart, orders)
        ├── api/             # API client layer
        ├── mocks/           # MSW handlers + demo data
        └── types/           # TypeScript types
```

## License

This project was made for educational purposes. Feel free to use or modify it.
