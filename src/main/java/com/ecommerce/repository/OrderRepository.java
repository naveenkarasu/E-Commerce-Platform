package com.ecommerce.repository;

import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Order entity operations.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders by user.
     */
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find all orders by user with pagination.
     */
    Page<Order> findByUser(User user, Pageable pageable);

    /**
     * Find orders by user ID.
     */
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find orders by status.
     */
    List<Order> findByStatus(Order.OrderStatus status);

    /**
     * Find orders by user and status.
     */
    List<Order> findByUserAndStatus(User user, Order.OrderStatus status);
}
