package com.epiis.reservacanchas.dto.response;

import com.epiis.reservacanchas.generic.ResponseGeneric;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseComplexGet extends ResponseGeneric {
    private String id;
    private String name;
    private String address;
    private String district;
    private String ownerId;
    private String status; // 'pending' | 'approved'
    private String phone;
    private String image;
    private Double rating;
    private Integer reviewsCount;
    private Integer pitchesCount;
    private String timeRange;
    private Boolean active;
}
