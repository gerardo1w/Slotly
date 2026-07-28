package com.epiis.reservacanchas.staticdata;

public enum EnumBookingStatus {
    ACTIVE("Activo"),
    CANCELLED("Cancelado"),
    RESERVED("Reservado");

    private final String description;

    EnumBookingStatus(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return this.description;
    }
}
