package com.epiis.reservacanchas.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RequestBookingCancel {

    @NotBlank(message = "El campo \"bookingId\" es requerido.")
    private String bookingId;

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
}
