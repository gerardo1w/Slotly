package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessComplex;
import com.epiis.reservacanchas.dto.request.RequestComplexApprove;
import com.epiis.reservacanchas.dto.request.RequestComplexUpdate;
import com.epiis.reservacanchas.dto.response.ResponseComplexGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complejos")
public class ComplexController {

    private final BusinessComplex businessComplex;

    public ComplexController(BusinessComplex businessComplex) {
        this.businessComplex = businessComplex;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll(@RequestParam(required = false, defaultValue = "false") boolean approvedOnly) {
        return ResponseEntity.ok(businessComplex.getAll(approvedOnly));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<Map<String, Object>>> actionGetApproved() {
        return ResponseEntity.ok(businessComplex.getAll(true));
    }

    @PostMapping("/approve")
    public ResponseEntity<ResponseComplexGet> actionApprove(@Valid @RequestBody RequestComplexApprove request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseComplexGet response = new ResponseComplexGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseComplexGet response = businessComplex.approve(request.getComplexId());
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponseComplexGet> actionUpdate(@Valid @RequestBody RequestComplexUpdate request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseComplexGet response = new ResponseComplexGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseComplexGet response = businessComplex.update(request);
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
