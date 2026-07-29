package com.epiis.reservacanchas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint raíz expuesto en GET / para satisfacer el healthcheck de Railway.
 * Railway verifica que el servicio responde 200 en la ruta configurada (default: "/").
 */
@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
