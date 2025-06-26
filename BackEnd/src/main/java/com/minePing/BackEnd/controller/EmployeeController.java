package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.service.EmployeeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/list/{companyNo}")
    public ResponseEntity<List<MemberDto.Response>> getAllMembers(@PathVariable Long companyNo) {
        return ResponseEntity.ok(employeeService.findAllMember(companyNo));
    }
}
