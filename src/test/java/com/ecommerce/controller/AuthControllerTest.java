package com.ecommerce.controller;

import com.ecommerce.dto.UserRegistrationDto;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 */
@RunWith(SpringRunner.class)
@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    public void testLoginPage() throws Exception {
        mockMvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(view().name("login"))
                .andExpect(model().attribute("pageTitle", "Login"));
    }

    @Test
    public void testRegisterPage() throws Exception {
        mockMvc.perform(get("/register"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"))
                .andExpect(model().attributeExists("user"))
                .andExpect(model().attribute("pageTitle", "Register"));
    }

    @Test
    public void testRegisterUser_Success() throws Exception {
        User newUser = new User();
        newUser.setUserId(1L);
        newUser.setEmail("new@example.com");
        newUser.setName("New User");

        when(userService.emailExists("new@example.com")).thenReturn(false);
        when(userService.registerUser(any(UserRegistrationDto.class))).thenReturn(newUser);

        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "New User")
                        .param("email", "new@example.com")
                        .param("password", "password123")
                        .param("confirmPassword", "password123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"))
                .andExpect(flash().attributeExists("successMessage"));
    }

    @Test
    public void testRegisterUser_ValidationError() throws Exception {
        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "")
                        .param("email", "invalid-email")
                        .param("password", "123")
                        .param("confirmPassword", "123"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"));
    }

    @Test
    public void testRegisterUser_PasswordMismatch() throws Exception {
        when(userService.emailExists("new@example.com")).thenReturn(false);

        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "New User")
                        .param("email", "new@example.com")
                        .param("password", "password123")
                        .param("confirmPassword", "different"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"));
    }

    @Test
    public void testRegisterUser_EmailExists() throws Exception {
        when(userService.emailExists("existing@example.com")).thenReturn(true);

        mockMvc.perform(post("/register")
                        .with(csrf())
                        .param("name", "New User")
                        .param("email", "existing@example.com")
                        .param("password", "password123")
                        .param("confirmPassword", "password123"))
                .andExpect(status().isOk())
                .andExpect(view().name("register"));
    }

    @Test
    public void testForgotPasswordPage() throws Exception {
        mockMvc.perform(get("/forgot-password"))
                .andExpect(status().isOk())
                .andExpect(view().name("forgot-password"))
                .andExpect(model().attribute("pageTitle", "Forgot Password"));
    }

    @Test
    public void testProcessForgotPassword() throws Exception {
        mockMvc.perform(post("/forgot-password")
                        .with(csrf())
                        .param("email", "user@example.com"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"))
                .andExpect(flash().attributeExists("successMessage"));
    }
}
