package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

/**
 * Controller for home page and general navigation.
 */
@Controller
public class HomeController {

    private final ProductService productService;

    @Autowired
    public HomeController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Display home page with featured products.
     */
    @GetMapping({"/", "/index"})
    public String home(Model model) {
        // Get recent products for home page
        List<Product> products = productService.getAllProducts();
        List<String> categories = productService.getAllCategories();

        // Limit to 8 featured products
        if (products.size() > 8) {
            products = products.subList(0, 8);
        }

        model.addAttribute("products", products);
        model.addAttribute("categories", categories);
        model.addAttribute("pageTitle", "Home");

        return "index";
    }

    /**
     * Display access denied page.
     */
    @GetMapping("/access-denied")
    public String accessDenied() {
        return "access-denied";
    }

    /**
     * Display about page.
     */
    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("pageTitle", "About Us");
        return "about";
    }

    /**
     * Display contact page.
     */
    @GetMapping("/contact")
    public String contact(Model model) {
        model.addAttribute("pageTitle", "Contact Us");
        return "contact";
    }
}
