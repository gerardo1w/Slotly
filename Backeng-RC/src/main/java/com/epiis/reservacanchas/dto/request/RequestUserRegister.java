package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RequestUserRegister {

    @NotBlank(message = "El campo \"name\" es requerido.")
    private String name;

    @NotBlank(message = "El campo \"email\" es requerido.")
    @Email(message = "El formato del email no es válido.")
    private String email;

    @NotBlank(message = "El campo \"password\" es requerido.")
    private String password;

    @NotBlank(message = "El campo \"role\" es requerido.")
    private String role; // 'client' | 'owner'

    private ComplexData complexData;

    @Getter
    @Setter
    public static class ComplexData {
        @NotBlank(message = "El campo \"name\" del complejo es requerido.")
        private String name;

        @NotBlank(message = "El campo \"address\" del complejo es requerido.")
        private String address;

        @NotBlank(message = "El campo \"district\" del complejo es requerido.")
        private String district;

        @NotBlank(message = "El campo \"phone\" del complejo es requerido.")
        private String phone;
    }
}
