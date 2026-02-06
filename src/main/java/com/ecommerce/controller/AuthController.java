package com.ecommerce.controller;

import com.ecommerce.dto.UserRegistrationDto;
import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.validation.Valid;

/**
 * Controller for authentication operations (login, register, logout).
 */
@Controller
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Display login page.
     */
    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("pageTitle", "Login");
        return "login";
    }

    /**
     * Display registration page.
     */
    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new UserRegistrationDto());
        model.addAttribute("pageTitle", "Register");
        return "register";
    }

    /**
     * Process registration form.
     */
    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") UserRegistrationDto registrationDto,
                               BindingResult bindingResult,
                               Model model,
                               RedirectAttributes redirectAttributes) {

        // Check for validation errors
        if (bindingResult.hasErrors()) {
            model.addAttribute("pageTitle", "Register");
            return "register";
        }

        // Check if passwords match
        if (!registrationDto.isPasswordMatching()) {
            bindingResult.rejectValue("confirmPassword", "error.user", "Passwords do not match");
            model.addAttribute("pageTitle", "Register");
            return "register";
        }

        // Check if email already exists
        if (userService.emailExists(registrationDto.getEmail())) {
            bindingResult.rejectValue("email", "error.user", "Email already registered");
            model.addAttribute("pageTitle", "Register");
            return "register";
        }

        try {
            userService.registerUser(registrationDto);
            redirectAttributes.addFlashAttribute("successMessage",
                    "Registration successful! Please login with your credentials.");
            return "redirect:/login";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Registration failed: " + e.getMessage());
            model.addAttribute("pageTitle", "Register");
            return "register";
        }
    }

    /**
     * Display forgot password page.
     */
    @GetMapping("/forgot-password")
    public String forgotPasswordPage(Model model) {
        model.addAttribute("pageTitle", "Forgot Password");
        return "forgot-password";
    }

    /**
     * Process forgot password form.
     */
    @PostMapping("/forgot-password")
    public String processForgotPassword(String email, RedirectAttributes redirectAttributes) {
        // In a real application, this would send a password reset email
        redirectAttributes.addFlashAttribute("successMessage",
                "If an account exists with this email, you will receive password reset instructions.");
        return "redirect:/login";
    }
}
