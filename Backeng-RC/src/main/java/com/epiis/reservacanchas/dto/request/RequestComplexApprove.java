package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RequestComplexApprove {

    @NotBlank(message = "El campo \"complexId\" es requerido.")
    private String complexId;
}
