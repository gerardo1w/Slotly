package com.epiis.reservacanchas.staticdata;

public enum EnumSubscriptionType {
    FREE("Gratuito"),
    PRO("Profesional");

    private final String description;

    EnumSubscriptionType(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return this.description;
    }
}
