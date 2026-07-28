package com.epiis.reservacanchas.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Getter
@Setter
public class RequestTransactionInsert {

    @NotBlank(message = "El campo \"complexId\" es requerido.")
    private String complexId;

    @NotBlank(message = "El campo \"type\" es requerido.")
    private String type; // 'income' | 'expense'

    @NotBlank(message = "El campo \"description\" es requerido.")
    private String description;

    @NotNull(message = "El campo \"amount\" es requerido.")
    @Positive(message = "El monto debe ser mayor a cero.")
    private Double amount;

    @NotBlank(message = "El campo \"date\" es requerido.")
    private String date; // format: YYYY-MM-DD
}
