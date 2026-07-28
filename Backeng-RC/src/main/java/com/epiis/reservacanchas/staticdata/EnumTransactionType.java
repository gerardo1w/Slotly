package com.epiis.reservacanchas.staticdata;

public enum EnumTransactionType {
    INCOME("Ingreso"),
    EXPENSE("Egreso");

    private final String description;

    EnumTransactionType(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return this.description;
    }
}
