package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.CompanyDto;
import com.minePing.BackEnd.service.CompanyService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping("/search")
    public ResponseEntity<List<CompanyDto.Search>> companySearch(@RequestParam String company_name) {

        return ResponseEntity.ok(companyService.getCompanyList(company_name));
    }

    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@RequestBody CompanyDto.Validate validateDto) {
        return ResponseEntity.ok().build();
    }

}
