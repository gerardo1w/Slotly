package com.epiis.reservacanchas.staticdata;

public enum EnumComplexStatus {
    PENDING("Pendiente"),
    APPROVED("Aprobado");

    private final String description;

    EnumComplexStatus(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return this.description;
    }
}
