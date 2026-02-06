package com.ecommerce.controller.api;

import com.ecommerce.dto.CheckoutDto;
import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Order management API")
@CrossOrigin(origins = "*")
public class ApiOrderController {

    private final OrderService orderService;

    @Autowired
    public ApiOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<Order> placeOrder(Authentication authentication,
                                             @Valid @RequestBody CheckoutDto checkoutDto) {
        Order order = orderService.placeOrder(authentication.getName(), checkoutDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    @Operation(summary = "Get all orders for current user")
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getOrdersForUser(authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<Order> getOrder(Authentication authentication, @PathVariable Long id) {
        return orderService.getOrderByIdForUser(id, authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<Order> cancelOrder(Authentication authentication, @PathVariable Long id) {
        Order order = orderService.cancelOrder(id, authentication.getName());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all orders (admin only)")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status (admin only)")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                    @RequestBody java.util.Map<String, String> request) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
