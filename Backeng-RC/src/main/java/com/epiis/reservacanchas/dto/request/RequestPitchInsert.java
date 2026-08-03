package com.epiis.reservacanchas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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

    public String getComplexId() { return complexId; }
    public void setComplexId(String complexId) { this.complexId = complexId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }
    public Double getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(Double pricePerHour) { this.pricePerHour = pricePerHour; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}