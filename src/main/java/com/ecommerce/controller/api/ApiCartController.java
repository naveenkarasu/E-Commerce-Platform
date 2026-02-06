package com.ecommerce.controller.api;

import com.ecommerce.model.Cart;
import com.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@Tag(name = "Cart", description = "Shopping cart API")
@CrossOrigin(origins = "*")
public class ApiCartController {

    private final CartService cartService;

    @Autowired
    public ApiCartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        Cart cart = cartService.getCartByUserEmail(authentication.getName());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<Cart> addToCart(Authentication authentication,
                                          @RequestBody Map<String, Object> request) {
        Long productId = Long.valueOf(request.get("productId").toString());
        int quantity = Integer.parseInt(request.get("quantity").toString());
        Cart cart = cartService.addToCart(authentication.getName(), productId, quantity);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/items/{productId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<Cart> updateCartItem(Authentication authentication,
                                                @PathVariable Long productId,
                                                @RequestBody Map<String, Integer> request) {
        Cart cart = cartService.updateCartItemQuantity(authentication.getName(), productId, request.get("quantity"));
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<Cart> removeFromCart(Authentication authentication,
                                               @PathVariable Long productId) {
        Cart cart = cartService.removeFromCart(authentication.getName(), productId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping
    @Operation(summary = "Clear cart")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total")
    @Operation(summary = "Get cart total")
    public ResponseEntity<Map<String, Object>> getCartTotal(Authentication authentication) {
        BigDecimal total = cartService.getCartTotal(authentication.getName());
        int itemCount = cartService.getCartItemCount(authentication.getName());
        return ResponseEntity.ok(Map.of("total", total, "itemCount", itemCount));
    }
}
