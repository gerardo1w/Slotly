package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class RequestUserToggleBlock {

    @NotBlank(message = "El campo \"userId\" es requerido.")
    private String userId;
}
