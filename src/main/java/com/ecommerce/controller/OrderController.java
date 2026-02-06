package com.ecommerce.controller;

import com.ecommerce.dto.CheckoutDto;
import com.ecommerce.model.Cart;
import com.ecommerce.model.Order;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * Controller for checkout and order management.
 */
@Controller
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;

    @Autowired
    public OrderController(OrderService orderService, CartService cartService) {
        this.orderService = orderService;
        this.cartService = cartService;
    }

    /**
     * Display checkout page.
     */
    @GetMapping("/checkout")
    public String checkoutPage(Authentication authentication, Model model,
                               RedirectAttributes redirectAttributes) {
        String userEmail = authentication.getName();
        Cart cart = cartService.getCartByUserEmail(userEmail);

        if (cart.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Your cart is empty.");
            return "redirect:/cart";
        }

        model.addAttribute("cart", cart);
        model.addAttribute("cartItems", cart.getItems());
        model.addAttribute("cartTotal", cart.getTotalPrice());
        model.addAttribute("checkoutDto", new CheckoutDto());
        model.addAttribute("pageTitle", "Checkout");

        return "checkout";
    }

    /**
     * Process checkout and place order.
     */
    @PostMapping("/checkout")
    public String processCheckout(
            @Valid @ModelAttribute("checkoutDto") CheckoutDto checkoutDto,
            BindingResult bindingResult,
            Authentication authentication,
            Model model,
            RedirectAttributes redirectAttributes) {

        String userEmail = authentication.getName();
        Cart cart = cartService.getCartByUserEmail(userEmail);

        if (bindingResult.hasErrors()) {
            model.addAttribute("cart", cart);
            model.addAttribute("cartItems", cart.getItems());
            model.addAttribute("cartTotal", cart.getTotalPrice());
            model.addAttribute("pageTitle", "Checkout");
            return "checkout";
        }

        try {
            Order order = orderService.placeOrder(userEmail, checkoutDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Order placed successfully! Order #" + order.getOrderId());
            return "redirect:/orders/" + order.getOrderId() + "/confirmation";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("cart", cart);
            model.addAttribute("cartItems", cart.getItems());
            model.addAttribute("cartTotal", cart.getTotalPrice());
            model.addAttribute("pageTitle", "Checkout");
            return "checkout";
        }
    }

    /**
     * Display order confirmation page.
     */
    @GetMapping("/orders/{orderId}/confirmation")
    public String orderConfirmation(
            @PathVariable("orderId") Long orderId,
            Authentication authentication,
            Model model,
            RedirectAttributes redirectAttributes) {

        String userEmail = authentication.getName();
        Optional<Order> order = orderService.getOrderByIdForUser(orderId, userEmail);

        if (order.isPresent()) {
            model.addAttribute("order", order.get());
            model.addAttribute("pageTitle", "Order Confirmation");
            return "order-confirmation";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Order not found.");
            return "redirect:/orders";
        }
    }

    /**
     * Display order history.
     */
    @GetMapping("/orders")
    public String orderHistory(Authentication authentication, Model model) {
        String userEmail = authentication.getName();
        List<Order> orders = orderService.getOrdersForUser(userEmail);

        model.addAttribute("orders", orders);
        model.addAttribute("pageTitle", "Order History");

        return "orders";
    }

    /**
     * Display order details.
     */
    @GetMapping("/orders/{orderId}")
    public String orderDetails(
            @PathVariable("orderId") Long orderId,
            Authentication authentication,
            Model model,
            RedirectAttributes redirectAttributes) {

        String userEmail = authentication.getName();
        Optional<Order> order = orderService.getOrderByIdForUser(orderId, userEmail);

        if (order.isPresent()) {
            model.addAttribute("order", order.get());
            model.addAttribute("pageTitle", "Order #" + orderId);
            return "order-details";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Order not found.");
            return "redirect:/orders";
        }
    }

    /**
     * Cancel an order.
     */
    @PostMapping("/orders/{orderId}/cancel")
    public String cancelOrder(
            @PathVariable("orderId") Long orderId,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {

        try {
            String userEmail = authentication.getName();
            orderService.cancelOrder(orderId, userEmail);
            redirectAttributes.addFlashAttribute("successMessage", "Order cancelled successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/orders/" + orderId;
    }
}
