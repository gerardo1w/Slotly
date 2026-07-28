package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class RequestComplexUpdate {

    @NotBlank(message = "El campo \"id\" es requerido.")
    private String id;

    @NotBlank(message = "El campo \"name\" es requerido.")
    private String name;

    @NotBlank(message = "El campo \"address\" es requerido.")
    private String address;

    @NotBlank(message = "El campo \"district\" es requerido.")
    private String district;

    @NotBlank(message = "El campo \"phone\" es requerido.")
    private String phone;

    private String image;

    private String timeRange;

    @NotNull(message = "El campo \"active\" es requerido.")
    private Boolean active;
}
