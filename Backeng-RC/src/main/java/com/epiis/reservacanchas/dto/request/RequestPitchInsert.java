package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Getter
@Setter
public class RequestPitchInsert {

    @NotBlank(message = "El campo \"complexId\" es requerido.")
    private String complexId;

    @NotBlank(message = "El campo \"name\" es requerido.")
    private String name;

    @NotBlank(message = "El campo \"sport\" es requerido.")
    private String sport;

    @NotNull(message = "El campo \"pricePerHour\" es requerido.")
    @Positive(message = "El precio por hora debe ser mayor a cero.")
    private Double pricePerHour;

    private String image;

    @NotNull(message = "El campo \"active\" es requerido.")
    private Boolean active;
}
