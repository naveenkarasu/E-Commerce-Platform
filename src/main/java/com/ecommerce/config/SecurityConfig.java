package com.ecommerce.config;

import com.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Spring Security configuration.
 * Configures authentication, authorization, login, and logout.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                // Public pages
                .antMatchers("/", "/index", "/products/**", "/search", "/category/**").permitAll()
                // Static resources
                .antMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                // Authentication pages
                .antMatchers("/login", "/register", "/forgot-password").permitAll()
                // Admin pages
                .antMatchers("/admin/**").hasRole("ADMIN")
                // Cart and checkout require authentication
                .antMatchers("/cart/**", "/checkout/**", "/orders/**").authenticated()
                // All other requests need authentication
                .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error=true")
                .usernameParameter("email")
                .passwordParameter("password")
                .permitAll()
            .and()
            .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            .and()
            .rememberMe()
                .key("uniqueAndSecretKey")
                .tokenValiditySeconds(86400) // 24 hours
            .and()
            .exceptionHandling()
                .accessDeniedPage("/access-denied")
            .and()
            .csrf()
                .ignoringAntMatchers("/api/**"); // Disable CSRF for API endpoints if needed
    }
}
