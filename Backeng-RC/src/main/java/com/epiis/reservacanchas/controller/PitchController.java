package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessPitch;
import com.epiis.reservacanchas.dto.request.RequestPitchInsert;
import com.epiis.reservacanchas.dto.request.RequestPitchUpdate;
import com.epiis.reservacanchas.dto.response.ResponsePitchGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/canchas")
public class PitchController {

    private final BusinessPitch businessPitch;

    public PitchController(BusinessPitch businessPitch) {
        this.businessPitch = businessPitch;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll(@RequestParam(required = false) String complexId) {
        return ResponseEntity.ok(businessPitch.getAll(complexId));
    }

    @PostMapping
    public ResponseEntity<ResponsePitchGet> actionInsert(@Valid @RequestBody RequestPitchInsert request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponsePitchGet response = new ResponsePitchGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponsePitchGet response = businessPitch.insert(request);
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ResponsePitchGet> actionUpdate(@Valid @RequestBody RequestPitchUpdate request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponsePitchGet response = new ResponsePitchGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponsePitchGet response = businessPitch.update(request);
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pitchId}")
    public ResponseEntity<ResponsePitchGet> actionDelete(@PathVariable String pitchId) {
        ResponsePitchGet response = businessPitch.delete(pitchId);
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
