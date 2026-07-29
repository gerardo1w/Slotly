package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessTransaction;
import com.epiis.reservacanchas.dto.request.RequestTransactionInsert;
import com.epiis.reservacanchas.dto.response.ResponseTransactionGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transacciones")
public class TransactionController {

    private final BusinessTransaction businessTransaction;

    public TransactionController(BusinessTransaction businessTransaction) {
        this.businessTransaction = businessTransaction;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll(@RequestParam String complexId) {
        return ResponseEntity.ok(businessTransaction.getAll(complexId));
    }

    @PostMapping
    public ResponseEntity<ResponseTransactionGet> actionInsert(
            @Valid @RequestBody RequestTransactionInsert request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseTransactionGet response = new ResponseTransactionGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(businessTransaction.insert(request));
    }
}
