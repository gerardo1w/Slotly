package com.epiis.reservacanchas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
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
        http
            .csrf(csrf -> csrf.disable())
            // Unica fuente de CORS: gestionada directamente por Spring Security.
            // (Se eliminó el CorsFilter manual duplicado que causaba conflicto de headers)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/docs",
                    "/docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/api-docs/**",
                    "/h2-console/**",
                    "/actuator",
                    "/actuator/**",
                    "/api/usuarios",
                    "/api/usuarios/login",
                    "/error"
                ).permitAll()
                .requestMatchers(HttpMethod.GET,     "/api/canchas").permitAll()
                .requestMatchers(HttpMethod.GET,     "/api/complejos").permitAll()
                .requestMatchers(HttpMethod.POST,    "/api/usuarios").permitAll()
                .requestMatchers(HttpMethod.POST,    "/api/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            );

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.decoder(jwtDecoder())));
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
                "sub",   "mock-user-id",
                "email", "mock@example.com",
                "name",  "Mock User",
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

    /**
     * Fuente de configuración CORS usada por Spring Security.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "https://*.up.railway.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        config.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}