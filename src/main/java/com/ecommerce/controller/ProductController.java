package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

/**
 * Controller for product catalog operations.
 */
@Controller
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Display all products with optional pagination.
     */
    @GetMapping("/products")
    public String listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {

        Page<Product> productPage = productService.getAllProducts(page, size);
        List<String> categories = productService.getAllCategories();

        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", "Products");

        return "products";
    }

    /**
     * Display product details.
     */
    @GetMapping("/products/{id}")
    public String productDetails(@PathVariable("id") Long productId, Model model) {
        Optional<Product> product = productService.getProductById(productId);

        if (product.isPresent()) {
            model.addAttribute("product", product.get());
            model.addAttribute("pageTitle", product.get().getName());

            // Get related products from the same category
            List<Product> relatedProducts = productService.getProductsByCategory(product.get().getCategory());
            relatedProducts.removeIf(p -> p.getProductId().equals(productId));
            if (relatedProducts.size() > 4) {
                relatedProducts = relatedProducts.subList(0, 4);
            }
            model.addAttribute("relatedProducts", relatedProducts);

            return "product-details";
        } else {
            return "redirect:/products?error=Product not found";
        }
    }

    /**
     * Display products by category.
     */
    @GetMapping("/category/{category}")
    public String productsByCategory(
            @PathVariable("category") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {

        Page<Product> productPage = productService.getProductsByCategory(category, page, size);
        List<String> categories = productService.getAllCategories();

        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategory", category);
        model.addAttribute("pageTitle", category);

        return "products";
    }

    /**
     * Search products.
     */
    @GetMapping("/search")
    public String searchProducts(
            @RequestParam("q") String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {

        Page<Product> productPage = productService.searchProducts(searchTerm, page, size);
        List<String> categories = productService.getAllCategories();

        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        model.addAttribute("categories", categories);
        model.addAttribute("searchTerm", searchTerm);
        model.addAttribute("pageTitle", "Search: " + searchTerm);

        return "products";
    }
}
