package com.epiis.reservacanchas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri:}")
    private String issuerUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors();
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/docs",
                    "/docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/h2-console/**",
                    "/usuarios",
                    "/api/usuarios",
                    "/usuarios/login",
                    "/api/usuarios/login",
                    "/error"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()
                .requestMatchers(HttpMethod.POST, "/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            );

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())));

        // Configure CORS globally for the API
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // Allow H2 console frames
        http.headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        if (issuerUri != null && !issuerUri.isEmpty()) {
            return NimbusJwtDecoder.withIssuerLocation(issuerUri).build();
        }
        return mockJwtDecoder();
    }

    private JwtDecoder mockJwtDecoder() {
        return token -> {
            Map<String, Object> headers = Map.of("alg", "none");
            Map<String, Object> claims = Map.of(
                "sub", "mock-user-id",
                "email", "mock@example.com",
                "name", "Mock User",
                "roles", Collections.singletonList("client")
            );
            return new Jwt(
                token,
                Instant.now().minusSeconds(3600),
                Instant.now().plusSeconds(3600),
                headers,
                claims
            );
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*") );
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
