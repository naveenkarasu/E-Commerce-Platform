package com.ecommerce.repository;

import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for OrderItem entity operations.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Find all items in an order.
     */
    List<OrderItem> findByOrder(Order order);

    /**
     * Find all items by order ID.
     */
    List<OrderItem> findByOrderOrderId(Long orderId);
}
