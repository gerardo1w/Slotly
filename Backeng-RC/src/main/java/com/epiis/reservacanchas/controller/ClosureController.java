package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessClosure;
import com.epiis.reservacanchas.dto.request.RequestClosureInsert;
import com.epiis.reservacanchas.dto.response.ResponseClosureGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cierres")
public class ClosureController {

    private final BusinessClosure businessClosure;

    public ClosureController(BusinessClosure businessClosure) {
        this.businessClosure = businessClosure;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll(@RequestParam String complexId) {
        return ResponseEntity.ok(businessClosure.getAll(complexId));
    }

    @PostMapping
    public ResponseEntity<ResponseClosureGet> actionInsert(
            @Valid @RequestBody RequestClosureInsert request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseClosureGet response = new ResponseClosureGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(businessClosure.insert(request));
    }
}
