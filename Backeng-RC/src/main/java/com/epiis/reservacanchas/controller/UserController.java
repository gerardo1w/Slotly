package com.epiis.reservacanchas.controller;

import com.epiis.reservacanchas.business.BusinessUser;
import com.epiis.reservacanchas.dto.request.RequestUserLogin;
import com.epiis.reservacanchas.dto.request.RequestUserRegister;
import com.epiis.reservacanchas.dto.request.RequestUserSubscribe;
import com.epiis.reservacanchas.dto.request.RequestUserToggleBlock;
import com.epiis.reservacanchas.dto.response.ResponseUserGet;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final BusinessUser businessUser;

    public UserController(BusinessUser businessUser) {
        this.businessUser = businessUser;
    }

    @PostMapping
    public ResponseEntity<ResponseUserGet> actionRegister(@Valid @RequestBody RequestUserRegister request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseUserGet response = new ResponseUserGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseUserGet resp = businessUser.register(request);
        if (resp.getType() != null && resp.getType().equals("error")) {
            return ResponseEntity.badRequest().body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseUserGet> actionLogin(@Valid @RequestBody RequestUserLogin request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseUserGet response = new ResponseUserGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseUserGet resp = businessUser.login(request);
        if (resp.getType() != null && resp.getType().equals("error")) {
            return ResponseEntity.badRequest().body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/subscribe")
    public ResponseEntity<ResponseUserGet> actionSubscribe(@Valid @RequestBody RequestUserSubscribe request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseUserGet response = new ResponseUserGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseUserGet response = businessUser.subscribeToPro(request.getUserId());
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/toggle-block")
    public ResponseEntity<ResponseUserGet> actionToggleBlock(@Valid @RequestBody RequestUserToggleBlock request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResponseUserGet response = new ResponseUserGet();
            response.error();
            bindingResult.getAllErrors().forEach(error -> response.getListMessage().add(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(response);
        }
        ResponseUserGet response = businessUser.toggleBlock(request.getUserId());
        if ("error".equals(response.getType())) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> actionGetAll() {
        return ResponseEntity.ok(businessUser.getAll());
    }
}
