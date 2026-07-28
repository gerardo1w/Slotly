package com.epiis.reservacanchas.dto.response;

import com.epiis.reservacanchas.generic.ResponseGeneric;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponsePitchGet extends ResponseGeneric {
    private String id;
    private String complexId;
    private String name;
    private String sport; // 'Fútbol' | 'Tenis' | 'Básquet' | 'Pádel' | 'Vóley'
    private Double pricePerHour;
    private String image;
    private Boolean active;
}
