package com.epiis.reservacanchas.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @PostConstruct
    public void initialize() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                ClassPathResource resource = new ClassPathResource("serviceAccountKey.json");
                if (resource.exists()) {
                    try (InputStream serviceAccount = resource.getInputStream()) {
                        FirebaseOptions options = FirebaseOptions.builder()
                                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                                .build();
                        FirebaseApp.initializeApp(options);
                        log.info("Firebase Admin SDK ha sido inicializado correctamente.");
                    }
                } else {
                    log.warn("Archivo 'serviceAccountKey.json' no encontrado en el classpath. La inicialización de Firebase Admin SDK se ha omitido. Coloque este archivo en src/main/resources para conectarse a Firebase.");
                }
            }
        } catch (IOException e) {
            log.error("Error al inicializar Firebase Admin SDK: ", e);
        }
    }
}
