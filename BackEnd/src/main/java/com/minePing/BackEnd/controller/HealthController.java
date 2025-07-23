package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.HealthDto;
import com.minePing.BackEnd.entity.Health;
import com.minePing.BackEnd.repository.CompanyProfileRepository;
import com.minePing.BackEnd.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HealthDto.Response> getHealth() {
        return ResponseEntity.ok(healthService.findByUserId());
    }

    @PostMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> insertHealth(@RequestBody HealthDto.Request healthDto) {
        healthService.saveHealth(healthDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateHealth(@RequestBody HealthDto.Request healthDto) {
        healthService.updateHealth(healthDto);
        return ResponseEntity.ok().build();
    }
}
