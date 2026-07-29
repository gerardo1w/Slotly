package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Getter
@Setter
public class RequestUserRegister {

    @NotBlank(message = "El campo \"name\" es requerido.")
    @Size(min = 3, max = 50, message = "El nombre debe tener entre 3 y 50 caracteres.")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$", message = "El nombre solo puede contener letras y espacios.")
    private String name;

    @NotBlank(message = "El campo \"email\" es requerido.")
    @Email(message = "El formato del email no es válido.")
    private String email;

    @NotBlank(message = "El campo \"password\" es requerido.")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.")
    private String password;

    @NotBlank(message = "El campo \"role\" es requerido.")
    private String role; // 'client' | 'owner'

    private ComplexData complexData;

    @Getter
    @Setter
    public static class ComplexData {
        @NotBlank(message = "El campo \"name\" del complejo es requerido.")
        @Size(min = 3, max = 100, message = "El nombre del complejo debe tener entre 3 y 100 caracteres.")
        private String name;

        @NotBlank(message = "El campo \"address\" del complejo es requerido.")
        private String address;

        @NotBlank(message = "El campo \"district\" del complejo es requerido.")
        private String district;

        @NotBlank(message = "El campo \"phone\" del complejo es requerido.")
        @Pattern(regexp = "^[0-9]{9}$", message = "El teléfono debe tener exactamente 9 dígitos numéricos.")
        private String phone;
    }
}
