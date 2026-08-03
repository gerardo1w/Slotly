package com.epiis.reservacanchas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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
    private String date;

    public String getComplexId() { return complexId; }
    public void setComplexId(String complexId) { this.complexId = complexId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}