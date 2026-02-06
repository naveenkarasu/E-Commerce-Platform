package com.ecommerce.service;

import com.ecommerce.dto.UserRegistrationDto;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for UserService.
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    public void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");
        testUser.setName("Test User");
        testUser.setRole(User.Role.CUSTOMER);
    }

    @Test
    public void testLoadUserByUsername_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        UserDetails result = userService.loadUserByUsername("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getUsername());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    public void testLoadUserByUsername_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("notfound@example.com");
        });
    }

    @Test
    public void testRegisterUser_Success() {
        UserRegistrationDto registrationDto = new UserRegistrationDto();
        registrationDto.setName("New User");
        registrationDto.setEmail("new@example.com");
        registrationDto.setPassword("password123");
        registrationDto.setConfirmPassword("password123");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(cartRepository.save(any())).thenReturn(null);

        User result = userService.registerUser(registrationDto);

        assertNotNull(result);
        verify(userRepository, times(1)).existsByEmail("new@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
        verify(cartRepository, times(1)).save(any());
    }

    @Test
    public void testRegisterUser_EmailExists() {
        UserRegistrationDto registrationDto = new UserRegistrationDto();
        registrationDto.setEmail("existing@example.com");
        registrationDto.setPassword("password123");
        registrationDto.setConfirmPassword("password123");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            userService.registerUser(registrationDto);
        });
    }

    @Test
    public void testRegisterUser_PasswordMismatch() {
        UserRegistrationDto registrationDto = new UserRegistrationDto();
        registrationDto.setEmail("new@example.com");
        registrationDto.setPassword("password123");
        registrationDto.setConfirmPassword("different");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            userService.registerUser(registrationDto);
        });
    }

    @Test
    public void testFindByEmail_Found() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    public void testFindByEmail_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.findByEmail("notfound@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    public void testFindById_Found() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals(Long.valueOf(1L), result.get().getUserId());
    }

    @Test
    public void testFindById_NotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(999L);

        assertFalse(result.isPresent());
    }

    @Test
    public void testEmailExists_True() {
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        boolean result = userService.emailExists("existing@example.com");

        assertTrue(result);
    }

    @Test
    public void testEmailExists_False() {
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);

        boolean result = userService.emailExists("new@example.com");

        assertFalse(result);
    }

    @Test
    public void testUpdateProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("newemail@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateProfile(1L, "New Name", "newemail@example.com");

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testUpdateProfile_EmailTaken() {
        User anotherUser = new User();
        anotherUser.setUserId(1L);
        anotherUser.setEmail("original@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(anotherUser));
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            userService.updateProfile(1L, "Name", "taken@example.com");
        });
    }

    @Test
    public void testChangePassword_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        userService.changePassword(1L, "oldPassword", "newPassword");

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testChangePassword_WrongCurrentPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            userService.changePassword(1L, "wrongPassword", "newPassword");
        });
    }

    @Test
    public void testGetCurrentUser_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        User result = userService.getCurrentUser("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    public void testGetCurrentUser_NotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            userService.getCurrentUser("notfound@example.com");
        });
    }
}
