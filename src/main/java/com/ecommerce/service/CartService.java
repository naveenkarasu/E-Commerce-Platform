package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Service for shopping cart operations.
 */
@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get cart for a user. Creates one if doesn't exist.
     */
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart(user);
                    return cartRepository.save(cart);
                });
    }

    /**
     * Get cart by user email.
     */
    @Transactional
    public Cart getCartByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateCart(user);
    }

    /**
     * Add item to cart.
     */
    @Transactional
    public Cart addToCart(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (!product.hasAvailableStock(quantity)) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if item already in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (!product.hasAvailableStock(newQuantity)) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Remove item from cart.
     */
    @Transactional
    public Cart removeFromCart(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        cart.getItems().removeIf(item -> item.getProduct().getProductId().equals(productId));

        return cartRepository.save(cart);
    }

    /**
     * Update item quantity in cart.
     */
    @Transactional
    public Cart updateCartItemQuantity(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);

        if (quantity <= 0) {
            return removeFromCart(userEmail, productId);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock availability
        if (!product.hasAvailableStock(quantity)) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getProductId().equals(productId)) {
                item.setQuantity(quantity);
                cartItemRepository.save(item);
                break;
            }
        }

        return cartRepository.save(cart);
    }

    /**
     * Clear all items from cart.
     */
    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    /**
     * Get cart total.
     */
    public BigDecimal getCartTotal(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        return cart.getTotalPrice();
    }

    /**
     * Get cart item count.
     */
    public int getCartItemCount(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        return cart.getTotalItems();
    }

    /**
     * Check if cart is empty.
     */
    public boolean isCartEmpty(String userEmail) {
        Cart cart = getCartByUserEmail(userEmail);
        return cart.isEmpty();
    }
}
