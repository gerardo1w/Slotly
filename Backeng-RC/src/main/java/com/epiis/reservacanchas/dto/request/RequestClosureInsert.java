package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RequestClosureInsert {

    @NotBlank(message = "El campo \"complexId\" es requerido.")
    private String complexId;

    @NotBlank(message = "El campo \"closedBy\" es requerido.")
    private String closedBy; // Email of the user closing
}
