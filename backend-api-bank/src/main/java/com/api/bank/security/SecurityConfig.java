package com.api.bank.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Desactivar CSRF para facilitar pruebas
                .authorizeRequests()
                .anyRequest().permitAll()  // Permitir todas las solicitudes sin autenticación
                .and()
                .httpBasic().disable();  // Desactivar autenticación básica para facilitar pruebas

        return http.build();
    }
}
