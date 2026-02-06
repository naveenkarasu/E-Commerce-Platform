package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controller for shopping cart operations.
 */
@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Display cart contents.
     */
    @GetMapping
    public String viewCart(Authentication authentication, Model model) {
        String userEmail = authentication.getName();
        Cart cart = cartService.getCartByUserEmail(userEmail);

        model.addAttribute("cart", cart);
        model.addAttribute("cartItems", cart.getItems());
        model.addAttribute("cartTotal", cart.getTotalPrice());
        model.addAttribute("pageTitle", "Shopping Cart");

        return "cart";
    }

    /**
     * Add item to cart.
     */
    @PostMapping("/add")
    public String addToCart(
            @RequestParam("productId") Long productId,
            @RequestParam(value = "quantity", defaultValue = "1") int quantity,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            cartService.addToCart(userEmail, productId, quantity);
            redirectAttributes.addFlashAttribute("successMessage", "Item added to cart!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/cart";
    }

    /**
     * Add item to cart and redirect back to product page.
     */
    @PostMapping("/add-and-continue")
    public String addToCartAndContinue(
            @RequestParam("productId") Long productId,
            @RequestParam(value = "quantity", defaultValue = "1") int quantity,
            @RequestParam(value = "returnUrl", defaultValue = "/products") String returnUrl,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            cartService.addToCart(userEmail, productId, quantity);
            redirectAttributes.addFlashAttribute("successMessage", "Item added to cart!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:" + returnUrl;
    }

    /**
     * Remove item from cart.
     */
    @PostMapping("/remove/{productId}")
    public String removeFromCart(
            @PathVariable("productId") Long productId,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            cartService.removeFromCart(userEmail, productId);
            redirectAttributes.addFlashAttribute("successMessage", "Item removed from cart.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/cart";
    }

    /**
     * Update item quantity in cart.
     */
    @PostMapping("/update")
    public String updateCartItem(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") int quantity,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            if (quantity <= 0) {
                cartService.removeFromCart(userEmail, productId);
                redirectAttributes.addFlashAttribute("successMessage", "Item removed from cart.");
            } else {
                cartService.updateCartItemQuantity(userEmail, productId, quantity);
                redirectAttributes.addFlashAttribute("successMessage", "Cart updated.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/cart";
    }

    /**
     * Clear entire cart.
     */
    @PostMapping("/clear")
    public String clearCart(
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            cartService.clearCart(userEmail);
            redirectAttributes.addFlashAttribute("successMessage", "Cart cleared.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/cart";
    }

    /**
     * Get cart item count (for AJAX).
     */
    @GetMapping("/count")
    @ResponseBody
    public int getCartCount(Authentication authentication) {
        if (authentication == null) {
            return 0;
        }
        String userEmail = authentication.getName();
        return cartService.getCartItemCount(userEmail);
    }
}
