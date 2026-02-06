# E-Commerce Platform

A full-stack online shopping platform with product browsing, cart management, secure checkout, and order tracking. Includes an admin panel for inventory and order management, Spring Security-based authentication, and automated order confirmation emails.

## Tech Stack

- **Backend:** Java 11, Spring Boot 2.1.9, Spring Data JPA, Spring Security
- **Frontend:** Thymeleaf, HTML, CSS, Bootstrap 4, JavaScript
- **Database:** MySQL 8.0
- **Email:** JavaMail (Spring Boot Starter Mail)
- **Build Tool:** Apache Maven

## Prerequisites

- JDK 11
- Apache Maven 3.x
- MySQL Server 8.0+

## Database Setup

1. Open MySQL and create the database:

```sql
CREATE DATABASE ecommerce_db;
USE ecommerce_db;
```

2. Run the schema file:

```bash
mysql -u root -p ecommerce_db < sql/schema.sql
```

3. Load sample data (optional):

```bash
mysql -u root -p ecommerce_db < sql/seed-data.sql
```

4. Update database credentials in `src/main/resources/application.properties`.

## Configuration

Update `src/main/resources/application.properties` with your settings:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password

# Email (for order confirmations)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

## How to Run

```bash
cd ecommerce-platform
mvn spring-boot:run
```

Then open in browser: `http://localhost:8080`

## Default Credentials

| Role     | Email              | Password     |
|----------|--------------------|--------------|
| Admin    | admin@shop.com     | admin123     |
| Customer | customer@gmail.com | customer123  |

## Features

- **Product Catalog** - Browse products by category, search by name
- **User Registration & Login** - Secure authentication with Spring Security
- **Shopping Cart** - Add/remove items, update quantities
- **Checkout** - Place orders with shipping address
- **Order Tracking** - View order history and status (Pending, Confirmed, Shipped, Delivered)
- **Email Notifications** - Order confirmation emails sent automatically
- **Admin Panel** - Manage products, view all orders, update order status
- **Inventory Management** - Stock tracking, low stock alerts

## Project Structure

```
ecommerce-platform/
├── pom.xml
├── sql/
│   ├── schema.sql
│   └── seed-data.sql
├── src/
│   ├── main/
│   │   ├── java/com/ecommerce/
│   │   │   ├── EcommerceApplication.java
│   │   │   ├── config/        # Security, Mail config
│   │   │   ├── controller/    # Web Controllers
│   │   │   ├── model/         # JPA Entities
│   │   │   ├── repository/    # Spring Data Repositories
│   │   │   ├── service/       # Business Logic
│   │   │   └── dto/           # Data Transfer Objects
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── templates/     # Thymeleaf templates
│   │       └── static/        # CSS, JS, Images
│   └── test/
│       └── java/com/ecommerce/
└── README.md
```

## API Endpoints

| Method | URL                  | Description          |
|--------|----------------------|----------------------|
| GET    | /                    | Home page            |
| GET    | /products            | Product listing      |
| GET    | /products/{id}       | Product details      |
| GET    | /cart                | View cart            |
| POST   | /cart/add            | Add item to cart     |
| POST   | /cart/remove         | Remove item from cart|
| GET    | /checkout            | Checkout page        |
| POST   | /orders/place        | Place order          |
| GET    | /orders              | Order history        |
| GET    | /admin/products      | Admin product mgmt   |
| GET    | /admin/orders        | Admin order mgmt     |

## Known Issues

- Payment gateway is simulated (no real payment processing)
- Product images are placeholder URLs
- No pagination on product listing page yet
- Email sending requires valid SMTP configuration

## License

This project was made for educational purposes. Feel free to use or modify it.
