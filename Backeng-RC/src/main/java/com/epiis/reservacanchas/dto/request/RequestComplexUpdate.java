package com.epiis.reservacanchas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}