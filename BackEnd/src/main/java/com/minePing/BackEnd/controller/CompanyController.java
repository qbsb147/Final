package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.CompanyDto;
import com.minePing.BackEnd.dto.DepartmentDto;
import com.minePing.BackEnd.service.CompanyService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/company")
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

    @GetMapping("/search/department/{company_no}")
    public ResponseEntity<List<DepartmentDto.Response>> departmentSearch(@PathVariable Long company_no) {
        return ResponseEntity.ok(companyService.getDepartmentList(company_no));
    }
}
