package com.epiis.reservacanchas.staticdata;

public enum EnumUserRole {
    CLIENT("Cliente"),
    OWNER("Dueño"),
    ADMIN("Administrador");

    private final String description;

    EnumUserRole(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return this.description;
    }
}
