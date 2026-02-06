-- Seed Data for E-Commerce Platform
-- Run this after schema.sql

USE ecommerce_db;

-- Users (BCrypt hashed passwords)
-- admin@shop.com / admin123
-- customer@gmail.com / customer123
INSERT INTO users (email, password, name, role) VALUES
('admin@shop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'ADMIN'),
('customer@gmail.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'John Doe', 'CUSTOMER'),
('jane@gmail.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Jane Smith', 'CUSTOMER');

-- Products - Electronics
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Wireless Bluetooth Headphones', 'Over-ear noise cancelling headphones with 30hr battery life', 2499.00, 50, 'Electronics', '/images/headphones.jpg'),
('USB-C Hub Adapter', '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader', 1299.00, 100, 'Electronics', '/images/usb-hub.jpg'),
('Portable Power Bank 10000mAh', 'Slim portable charger with dual USB output', 899.00, 75, 'Electronics', '/images/powerbank.jpg'),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches', 3499.00, 30, 'Electronics', '/images/keyboard.jpg');

-- Products - Books
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Clean Code by Robert Martin', 'A handbook of agile software craftsmanship', 599.00, 40, 'Books', '/images/clean-code.jpg'),
('Head First Java', 'A brain-friendly guide to learning Java programming', 499.00, 35, 'Books', '/images/head-first-java.jpg'),
('The Pragmatic Programmer', 'Your journey to mastery, 20th anniversary edition', 649.00, 25, 'Books', '/images/pragmatic.jpg');

-- Products - Clothing
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Cotton Round Neck T-Shirt', 'Comfortable 100% cotton t-shirt, available in multiple colors', 399.00, 200, 'Clothing', '/images/tshirt.jpg'),
('Slim Fit Jeans', 'Stretchable denim jeans with modern slim fit', 1299.00, 80, 'Clothing', '/images/jeans.jpg'),
('Hooded Sweatshirt', 'Warm fleece-lined hoodie for winter', 999.00, 60, 'Clothing', '/images/hoodie.jpg');

-- Products - Home
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Stainless Steel Water Bottle', 'Double-walled insulated bottle, keeps drinks cold 24hrs', 599.00, 120, 'Home', '/images/bottle.jpg'),
('LED Desk Lamp', 'Adjustable LED desk lamp with 3 brightness levels', 799.00, 45, 'Home', '/images/desk-lamp.jpg'),
('Bamboo Cutting Board', 'Eco-friendly bamboo cutting board, large size', 449.00, 55, 'Home', '/images/cutting-board.jpg'),
('Ceramic Coffee Mug Set', 'Set of 4 ceramic mugs, 300ml each', 699.00, 40, 'Home', '/images/mugs.jpg'),
('Wall Clock - Minimalist', 'Modern minimalist wall clock, 12 inch diameter', 549.00, 35, 'Home', '/images/clock.jpg');

-- Sample Cart for customer
INSERT INTO cart (user_id) VALUES (2);

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 5, 2),
(1, 8, 1);

-- Sample Order
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_status, created_at) VALUES
(2, 3896.00, 'DELIVERED', '42 MG Road, Bangalore, Karnataka 560001', 'COMPLETED', '2019-10-15 14:30:00'),
(2, 2498.00, 'CONFIRMED', '42 MG Road, Bangalore, Karnataka 560001', 'COMPLETED', '2019-11-20 10:15:00');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 2499.00),
(1, 8, 1, 399.00),
(1, 5, 1, 599.00),
(1, 8, 1, 399.00),
(2, 3, 1, 899.00),
(2, 9, 1, 1299.00),
(2, 11, 1, 599.00);
