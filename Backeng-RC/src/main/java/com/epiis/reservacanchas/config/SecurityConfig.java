package com.epiis.reservacanchas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
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
            // Spring Security también aplica CORS internamente para respetar nuestro corsConfigurationSource
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
     * Fuente de configuración CORS compartida entre Spring Security y el filtro servlet.
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

    /**
     * CorsFilter a nivel servlet con MAXIMA prioridad.
     * IMPORTANTE: el nombre del bean NO es "corsFilter" para evitar el conflicto
     * con el CorsFilter interno de Spring Security que busca ese nombre.
     */
    @Bean(name = "appCorsFilter")
    public FilterRegistrationBean<CorsFilter> appCorsFilter(CorsConfigurationSource corsConfigurationSource) {
        FilterRegistrationBean<CorsFilter> bean =
            new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
