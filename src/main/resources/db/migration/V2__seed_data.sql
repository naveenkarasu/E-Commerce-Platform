-- Seed Data for E-Commerce Platform

-- Insert admin user (password: admin123 - BCrypt encoded)
INSERT INTO users (email, password, name, role) VALUES
('admin@ecommerce.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'Admin User', 'ADMIN');

-- Insert sample customer (password: customer123 - BCrypt encoded)
INSERT INTO users (email, password, name, role) VALUES
('customer@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'John Customer', 'CUSTOMER');

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES
('Laptop Pro 15', 'High-performance laptop with 15-inch display, Intel i7 processor, 16GB RAM, 512GB SSD', 1299.99, 50, 'Electronics', 'https://via.placeholder.com/300x200?text=Laptop+Pro+15'),
('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking and long battery life', 29.99, 200, 'Electronics', 'https://via.placeholder.com/300x200?text=Wireless+Mouse'),
('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 89.99, 100, 'Electronics', 'https://via.placeholder.com/300x200?text=Mechanical+Keyboard'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI, USB 3.0, and card reader', 49.99, 150, 'Electronics', 'https://via.placeholder.com/300x200?text=USB-C+Hub'),
('Bluetooth Headphones', 'Over-ear wireless headphones with active noise cancellation', 199.99, 75, 'Electronics', 'https://via.placeholder.com/300x200?text=Bluetooth+Headphones'),
('Running Shoes', 'Lightweight running shoes with responsive cushioning', 119.99, 80, 'Sports', 'https://via.placeholder.com/300x200?text=Running+Shoes'),
('Yoga Mat', 'Premium non-slip yoga mat with carrying strap', 34.99, 120, 'Sports', 'https://via.placeholder.com/300x200?text=Yoga+Mat'),
('Water Bottle', 'Insulated stainless steel water bottle, 32oz', 24.99, 200, 'Sports', 'https://via.placeholder.com/300x200?text=Water+Bottle'),
('Cotton T-Shirt', 'Classic fit 100% cotton t-shirt', 19.99, 300, 'Clothing', 'https://via.placeholder.com/300x200?text=Cotton+T-Shirt'),
('Denim Jeans', 'Slim fit denim jeans with stretch comfort', 59.99, 150, 'Clothing', 'https://via.placeholder.com/300x200?text=Denim+Jeans'),
('Leather Wallet', 'Genuine leather bifold wallet with RFID protection', 39.99, 100, 'Accessories', 'https://via.placeholder.com/300x200?text=Leather+Wallet'),
('Sunglasses', 'Polarized UV protection sunglasses', 79.99, 80, 'Accessories', 'https://via.placeholder.com/300x200?text=Sunglasses'),
('Backpack', 'Durable laptop backpack with multiple compartments', 69.99, 90, 'Accessories', 'https://via.placeholder.com/300x200?text=Backpack'),
('Coffee Maker', 'Programmable 12-cup coffee maker with thermal carafe', 79.99, 60, 'Home', 'https://via.placeholder.com/300x200?text=Coffee+Maker'),
('Desk Lamp', 'LED desk lamp with adjustable brightness and color temperature', 44.99, 100, 'Home', 'https://via.placeholder.com/300x200?text=Desk+Lamp'),
('Plant Pot Set', 'Set of 3 ceramic plant pots with drainage holes', 29.99, 80, 'Home', 'https://via.placeholder.com/300x200?text=Plant+Pot+Set');

-- Create cart for sample customer
INSERT INTO cart (user_id) VALUES (2);
