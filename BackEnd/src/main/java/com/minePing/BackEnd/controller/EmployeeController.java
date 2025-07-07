package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.CompanyProfileDto;
import com.minePing.BackEnd.dto.CompanyProfileDto.Response;
import com.minePing.BackEnd.dto.PageResponse;
import com.minePing.BackEnd.service.EmployeeService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/list/{companyNo}")
    public ResponseEntity<PageResponse<Response>> getAllMembers(
            @PathVariable Long companyNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(employeeService.findAllMember(companyNo, pageable)));
    }

    @GetMapping("/applies/{companyNo}")
    public ResponseEntity<List<CompanyProfileDto.Approval>> getApprovalList(@PathVariable Long companyNo){
        return ResponseEntity.ok(employeeService.findgetApprovalList(companyNo));
    }

    @GetMapping("/needs-consult/{companyNo}")
    public ResponseEntity<PageResponse<CompanyProfileDto.Consult>> getNeedsConsult(
            @PathVariable Long companyNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable){
        return ResponseEntity.ok(new PageResponse<>(employeeService.findConsultList(companyNo,pageable)));
    }

    @GetMapping("/worcation-applies/{companyNo}")
    public ResponseEntity<PageResponse<CompanyProfileDto.Applies>> getWorcationApplies(
            @PathVariable Long companyNo,
            @PageableDefault(size = 10, sort = "userName") Pageable pageable){
        return ResponseEntity.ok(new PageResponse<>(employeeService.findWorcationAppliesList(companyNo,pageable)));
    }

    @GetMapping("/employees-summary/{companyNo}")
    public ResponseEntity<CompanyProfileDto.Employees> getEmployeesNumber(@PathVariable Long companyNo){
        return ResponseEntity.ok(employeeService.findEmployeesNumber(companyNo));
    }

    @PatchMapping("/applies/{userNo}")
    public ResponseEntity<String> updateStatus(@PathVariable Long userNo, @RequestBody Map<String, String> request ){
        String status = request.get("status"); // 'Y' 또는 'N'
        employeeService.updateApproveStatus(userNo, status);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/worcation-applies/{userNo}")
    public ResponseEntity<String> updateWorcationStatus(@PathVariable Long userNo, @RequestBody Map<String, String> request ){
        String status = request.get("status");
        employeeService.updateWorcationStatus(userNo,status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/worcation-calendar/{companyNo}")
    public ResponseEntity<List<CompanyProfileDto.Calendar>> getWorcationCalendar(@PathVariable Long companyNo){
        return  ResponseEntity.ok(employeeService.getWorcationCalendar(companyNo));
    }
}
