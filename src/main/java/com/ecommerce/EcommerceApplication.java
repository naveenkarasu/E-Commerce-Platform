package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the E-Commerce Platform.
 * This application provides a complete online shopping experience
 * with product catalog, shopping cart, checkout, and order management.
 *
 * @author E-Commerce Team
 * @version 1.0.0
 * @since 2019
 */
@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
}
