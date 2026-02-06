package com.ecommerce.repository;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for CartItem entity operations.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Find all items in a cart.
     */
    List<CartItem> findByCart(Cart cart);

    /**
     * Find a specific item in a cart by product.
     */
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    /**
     * Delete all items from a cart.
     */
    void deleteByCart(Cart cart);
}
