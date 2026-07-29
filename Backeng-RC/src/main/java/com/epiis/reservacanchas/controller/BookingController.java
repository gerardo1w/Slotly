package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessBooking;
import com.epiis.reservacanchas.dto.request.RequestBookingInsert;
import com.epiis.reservacanchas.dto.request.RequestBookingCancel;
import com.epiis.reservacanchas.dto.response.ResponseBookingGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class BookingController {

    private final BusinessBooking businessBooking;

    public BookingController(BusinessBooking businessBooking) {
        this.businessBooking = businessBooking;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll(
            @RequestParam(required = false) String clientEmail,
            @RequestParam(required = false) String complexId) {
        return ResponseEntity.ok(businessBooking.getAll(clientEmail, complexId));
    }

    @PostMapping
    public ResponseEntity<ResponseBookingGet> actionInsert(
            @Valid @RequestBody RequestBookingInsert request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseBookingGet response = new ResponseBookingGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(businessBooking.insert(request));
    }

    @PutMapping("/cancel")
    public ResponseEntity<ResponseBookingGet> actionCancel(
            @Valid @RequestBody RequestBookingCancel request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseBookingGet response = new ResponseBookingGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseBookingGet response = businessBooking.cancel(request);
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
