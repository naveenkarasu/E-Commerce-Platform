package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ProductController.
 */
@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private UserService userService;

    private Product createTestProduct() {
        Product product = new Product();
        product.setProductId(1L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(new BigDecimal("99.99"));
        product.setStockQuantity(100);
        product.setCategory("Electronics");
        return product;
    }

    @Test
    @WithMockUser
    public void testListProducts() throws Exception {
        Product product = createTestProduct();
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));

        when(productService.getAllProducts(anyInt(), anyInt())).thenReturn(productPage);
        when(productService.getAllCategories()).thenReturn(Arrays.asList("Electronics", "Clothing"));

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(view().name("products"))
                .andExpect(model().attributeExists("products"))
                .andExpect(model().attributeExists("categories"))
                .andExpect(model().attributeExists("currentPage"))
                .andExpect(model().attributeExists("totalPages"));
    }

    @Test
    @WithMockUser
    public void testProductDetails_Found() throws Exception {
        Product product = createTestProduct();

        when(productService.getProductById(1L)).thenReturn(Optional.of(product));
        when(productService.getProductsByCategory("Electronics")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(view().name("product-details"))
                .andExpect(model().attributeExists("product"));
    }

    @Test
    @WithMockUser
    public void testProductDetails_NotFound() throws Exception {
        when(productService.getProductById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/products/999"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("/products*"));
    }

    @Test
    @WithMockUser
    public void testProductsByCategory() throws Exception {
        Product product = createTestProduct();
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));

        when(productService.getProductsByCategory(eq("Electronics"), anyInt(), anyInt())).thenReturn(productPage);
        when(productService.getAllCategories()).thenReturn(Arrays.asList("Electronics", "Clothing"));

        mockMvc.perform(get("/category/Electronics"))
                .andExpect(status().isOk())
                .andExpect(view().name("products"))
                .andExpect(model().attributeExists("products"))
                .andExpect(model().attribute("selectedCategory", "Electronics"));
    }

    @Test
    @WithMockUser
    public void testSearchProducts() throws Exception {
        Product product = createTestProduct();
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));

        when(productService.searchProducts(eq("Test"), anyInt(), anyInt())).thenReturn(productPage);
        when(productService.getAllCategories()).thenReturn(Arrays.asList("Electronics", "Clothing"));

        mockMvc.perform(get("/search").param("q", "Test"))
                .andExpect(status().isOk())
                .andExpect(view().name("products"))
                .andExpect(model().attributeExists("products"))
                .andExpect(model().attribute("searchTerm", "Test"));
    }

    @Test
    @WithMockUser
    public void testListProducts_EmptyResult() throws Exception {
        Page<Product> emptyPage = new PageImpl<>(Collections.emptyList());

        when(productService.getAllProducts(anyInt(), anyInt())).thenReturn(emptyPage);
        when(productService.getAllCategories()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(view().name("products"))
                .andExpect(model().attribute("totalItems", 0L));
    }
}
