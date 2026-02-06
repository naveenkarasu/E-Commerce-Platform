package com.ecommerce.service;

import com.ecommerce.dto.CheckoutDto;
import com.ecommerce.model.*;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for order management operations.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final EmailService emailService;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        ProductRepository productRepository, CartService cartService,
                        EmailService emailService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
        this.emailService = emailService;
    }

    /**
     * Place a new order from cart.
     */
    @Transactional
    public Order placeOrder(String userEmail, CheckoutDto checkoutDto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.getCartByUserEmail(userEmail);

        if (cart.isEmpty()) {
            throw new RuntimeException("Cannot place order with empty cart");
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(checkoutDto.getFullAddress());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);

        // Add items from cart to order and reduce stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Verify stock availability
            if (!product.hasAvailableStock(cartItem.getQuantity())) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = OrderItem.fromCartItem(cartItem);
            order.addItem(orderItem);

            // Reduce product stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Calculate total
        order.calculateTotalAmount();

        // Simulate payment processing (always succeeds)
        boolean paymentSuccess = processPayment(checkoutDto);

        if (paymentSuccess) {
            order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
            order.setStatus(Order.OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.FAILED);
            throw new RuntimeException("Payment failed. Please try again.");
        }

        // Save order
        order = orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userEmail);

        // Send confirmation email
        try {
            emailService.sendOrderConfirmation(order);
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }

        return order;
    }

    /**
     * Simulated payment processing - always succeeds.
     */
    private boolean processPayment(CheckoutDto checkoutDto) {
        // In a real application, this would integrate with a payment gateway
        // For this project, payment always succeeds
        return true;
    }

    /**
     * Get order by ID.
     */
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    /**
     * Get order by ID for a specific user.
     */
    public Optional<Order> getOrderByIdForUser(Long orderId, String userEmail) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getUser().getEmail().equals(userEmail));
    }

    /**
     * Get all orders for a user.
     */
    public List<Order> getOrdersForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Get all orders (admin).
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Update order status.
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    /**
     * Cancel an order.
     */
    @Transactional
    public Order cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify user owns this order
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Can only cancel pending or confirmed orders
        if (order.getStatus() != Order.OrderStatus.PENDING &&
            order.getStatus() != Order.OrderStatus.CONFIRMED) {
            throw new RuntimeException("Cannot cancel order in current status: " + order.getStatus());
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    /**
     * Get orders by status.
     */
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
