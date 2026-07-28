package com.epiis.reservacanchas.dto.response;

import com.epiis.reservacanchas.generic.ResponseGeneric;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseTransactionGet extends ResponseGeneric {
    private String id;
    private String complexId;
    private String type; // 'income' | 'expense'
    private String description;
    private Double amount;
    private String date; // format: YYYY-MM-DD
}
