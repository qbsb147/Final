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

    //회원가입시 회사 검색
    @GetMapping("/search")
    public ResponseEntity<List<CompanyDto.Search>> companySearch(@RequestParam String company_name) {
        return ResponseEntity.ok(companyService.getCompanyList(company_name));
    }

    //회원가입시 회사 검색 결과 검증
    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@RequestBody CompanyDto.Validate validateDto) {
        return ResponseEntity.ok().build();
    }

    //회원가입시 부서 검색
    @GetMapping("/search/department/{company_no}")
    public ResponseEntity<List<DepartmentDto.Response>> departmentSearch(@PathVariable Long company_no) {
        return ResponseEntity.ok(companyService.getDepartmentList(company_no));
    }
}
