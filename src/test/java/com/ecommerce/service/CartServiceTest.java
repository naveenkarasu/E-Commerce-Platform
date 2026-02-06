package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for CartService.
 */
@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Cart testCart;
    private Product testProduct;

    @BeforeEach
    public void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("test@example.com");
        testUser.setName("Test User");

        testCart = new Cart();
        testCart.setCartId(1L);
        testCart.setUser(testUser);
        testCart.setItems(new ArrayList<>());

        testProduct = new Product();
        testProduct.setProductId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setStockQuantity(100);
    }

    @Test
    public void testGetOrCreateCart_ExistingCart() {
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        Cart result = cartService.getOrCreateCart(testUser);

        assertNotNull(result);
        assertEquals(testCart.getCartId(), result.getCartId());
        verify(cartRepository, times(1)).findByUser(testUser);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    public void testGetOrCreateCart_NewCart() {
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        Cart result = cartService.getOrCreateCart(testUser);

        assertNotNull(result);
        verify(cartRepository, times(1)).findByUser(testUser);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    public void testGetCartByUserEmail() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        Cart result = cartService.getCartByUserEmail("test@example.com");

        assertNotNull(result);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    public void testGetCartByUserEmail_UserNotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            cartService.getCartByUserEmail("notfound@example.com");
        });
    }

    @Test
    public void testAddToCart_NewItem() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(cartItemRepository.findByCartAndProduct(testCart, testProduct)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(new CartItem());
        when(cartRepository.save(testCart)).thenReturn(testCart);

        Cart result = cartService.addToCart("test@example.com", 1L, 2);

        assertNotNull(result);
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    public void testAddToCart_ExistingItem() {
        CartItem existingItem = new CartItem(testCart, testProduct, 1);
        existingItem.setCartItemId(1L);
        testCart.getItems().add(existingItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(cartItemRepository.findByCartAndProduct(testCart, testProduct)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(existingItem);
        when(cartRepository.save(testCart)).thenReturn(testCart);

        Cart result = cartService.addToCart("test@example.com", 1L, 2);

        assertNotNull(result);
        assertEquals(Integer.valueOf(3), existingItem.getQuantity()); // 1 + 2
    }

    @Test
    public void testAddToCart_InsufficientStock() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        assertThrows(RuntimeException.class, () -> {
            cartService.addToCart("test@example.com", 1L, 150); // More than stock
        });
    }

    @Test
    public void testRemoveFromCart() {
        CartItem cartItem = new CartItem(testCart, testProduct, 1);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(testCart)).thenReturn(testCart);

        Cart result = cartService.removeFromCart("test@example.com", 1L);

        assertNotNull(result);
        assertTrue(result.getItems().isEmpty());
    }

    @Test
    public void testUpdateCartItemQuantity() {
        CartItem cartItem = new CartItem(testCart, testProduct, 1);
        cartItem.setCartItemId(1L);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);
        when(cartRepository.save(testCart)).thenReturn(testCart);

        Cart result = cartService.updateCartItemQuantity("test@example.com", 1L, 5);

        assertNotNull(result);
        assertEquals(Integer.valueOf(5), cartItem.getQuantity());
    }

    @Test
    public void testClearCart() {
        CartItem cartItem = new CartItem(testCart, testProduct, 1);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(testCart)).thenReturn(testCart);

        cartService.clearCart("test@example.com");

        assertTrue(testCart.getItems().isEmpty());
        verify(cartRepository, times(1)).save(testCart);
    }

    @Test
    public void testGetCartTotal() {
        CartItem cartItem = new CartItem(testCart, testProduct, 2);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        BigDecimal result = cartService.getCartTotal("test@example.com");

        assertEquals(new BigDecimal("199.98"), result);
    }

    @Test
    public void testGetCartItemCount() {
        CartItem cartItem = new CartItem(testCart, testProduct, 3);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        int result = cartService.getCartItemCount("test@example.com");

        assertEquals(3, result);
    }

    @Test
    public void testIsCartEmpty_True() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        boolean result = cartService.isCartEmpty("test@example.com");

        assertTrue(result);
    }

    @Test
    public void testIsCartEmpty_False() {
        CartItem cartItem = new CartItem(testCart, testProduct, 1);
        testCart.getItems().add(cartItem);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));

        boolean result = cartService.isCartEmpty("test@example.com");

        assertFalse(result);
    }
}
