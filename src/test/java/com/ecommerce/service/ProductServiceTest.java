package com.ecommerce.service;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProductService.
 */
@RunWith(MockitoJUnitRunner.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @Before
    public void setUp() {
        testProduct = new Product();
        testProduct.setProductId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setStockQuantity(100);
        testProduct.setCategory("Electronics");
    }

    @Test
    public void testGetAllProducts() {
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAll(any(org.springframework.data.domain.Sort.class))).thenReturn(products);

        List<Product> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());
        verify(productRepository, times(1)).findAll(any(org.springframework.data.domain.Sort.class));
    }

    @Test
    public void testGetProductById_Found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        Optional<Product> result = productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals("Test Product", result.get().getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    public void testGetProductById_NotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Product> result = productService.getProductById(999L);

        assertFalse(result.isPresent());
        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    public void testGetProductsByCategory() {
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findByCategory("Electronics")).thenReturn(products);

        List<Product> result = productService.getProductsByCategory("Electronics");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Electronics", result.get(0).getCategory());
        verify(productRepository, times(1)).findByCategory("Electronics");
    }

    @Test
    public void testSearchProducts() {
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.searchProducts("Test")).thenReturn(products);

        List<Product> result = productService.searchProducts("Test");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository, times(1)).searchProducts("Test");
    }

    @Test
    public void testCreateProduct() {
        ProductDto productDto = new ProductDto();
        productDto.setName("New Product");
        productDto.setDescription("New Description");
        productDto.setPrice(new BigDecimal("149.99"));
        productDto.setStockQuantity(50);
        productDto.setCategory("Electronics");

        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product result = productService.createProduct(productDto);

        assertNotNull(result);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    public void testUpdateProduct() {
        ProductDto productDto = new ProductDto();
        productDto.setName("Updated Product");
        productDto.setDescription("Updated Description");
        productDto.setPrice(new BigDecimal("199.99"));
        productDto.setStockQuantity(75);
        productDto.setCategory("Electronics");

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        Product result = productService.updateProduct(1L, productDto);

        assertNotNull(result);
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test(expected = RuntimeException.class)
    public void testUpdateProduct_NotFound() {
        ProductDto productDto = new ProductDto();
        productDto.setName("Updated Product");

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        productService.updateProduct(999L, productDto);
    }

    @Test
    public void testDeleteProduct() {
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).existsById(1L);
        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test(expected = RuntimeException.class)
    public void testDeleteProduct_NotFound() {
        when(productRepository.existsById(999L)).thenReturn(false);

        productService.deleteProduct(999L);
    }

    @Test
    public void testReduceStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        productService.reduceStock(1L, 10);

        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test(expected = RuntimeException.class)
    public void testReduceStock_InsufficientStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        productService.reduceStock(1L, 150); // More than available stock
    }

    @Test
    public void testIsAvailable_True() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        boolean result = productService.isAvailable(1L, 50);

        assertTrue(result);
    }

    @Test
    public void testIsAvailable_False() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        boolean result = productService.isAvailable(1L, 150);

        assertFalse(result);
    }

    @Test
    public void testIsAvailable_ProductNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = productService.isAvailable(999L, 1);

        assertFalse(result);
    }
}
