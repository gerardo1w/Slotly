package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Getter
@Setter
public class RequestBookingInsert {

    @NotBlank(message = "El campo \"pitchId\" es requerido.")
    private String pitchId;

    @NotBlank(message = "El campo \"complexId\" es requerido.")
    private String complexId;

    @NotBlank(message = "El campo \"complexName\" es requerido.")
    private String complexName;

    @NotBlank(message = "El campo \"pitchName\" es requerido.")
    private String pitchName;

    @NotBlank(message = "El campo \"sport\" es requerido.")
    private String sport;

    @NotBlank(message = "El campo \"clientName\" es requerido.")
    private String clientName;

    @NotBlank(message = "El campo \"clientEmail\" es requerido.")
    @Email(message = "El formato del email no es válido.")
    private String clientEmail;

    @NotBlank(message = "El campo \"date\" es requerido.")
    private String date;

    @NotBlank(message = "El campo \"timeSlot\" es requerido.")
    private String timeSlot;

    @NotNull(message = "El campo \"price\" es requerido.")
    @Positive(message = "El precio debe ser mayor a cero.")
    private Double price;

    @NotBlank(message = "El campo \"paymentMethod\" es requerido.")
    private String paymentMethod; // 'Yape' | 'Plin' | 'Culqi'
}
