package com.epiis.reservacanchas.dto.response;

import com.epiis.reservacanchas.generic.ResponseGeneric;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseBookingGet extends ResponseGeneric {
    private String id;
    private String pitchId;
    private String complexId;
    private String complexName;
    private String pitchName;
    private String sport;
    private String clientName;
    private String clientEmail;
    private String date;
    private String timeSlot;
    private Double price;
    private String status; // 'active' | 'cancelled' | 'reserved'
    private String paymentMethod; // 'Yape' | 'Plin' | 'Culqi'
}
