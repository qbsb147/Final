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
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    //회사 직원 목록 조회
    @GetMapping("/list/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<PageResponse<Response>> getAllMembers(
            @PathVariable Long companyNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable) {
        return ResponseEntity.ok(new PageResponse<>(employeeService.findAllMember(companyNo, pageable)));
    }

    //회사 직원 승인 목록 조회
    @GetMapping("/applies/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<List<CompanyProfileDto.Approval>> getApprovalList(@PathVariable Long companyNo){
        return ResponseEntity.ok(employeeService.findgetApprovalList(companyNo));
    }

    //회사 직원 상담 목록 조회
    @GetMapping("/needs-consult/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<PageResponse<CompanyProfileDto.Consult>> getNeedsConsult(
            @PathVariable Long companyNo,
            @PageableDefault(size = 15, sort = "userName") Pageable pageable){
        return ResponseEntity.ok(new PageResponse<>(employeeService.findConsultList(companyNo,pageable)));
    }

    //회사 직원 워케이션 신청 목록 조회
    @GetMapping("/worcation-applies/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<PageResponse<CompanyProfileDto.Applies>> getWorcationApplies(
            @PathVariable Long companyNo,
            @PageableDefault(size = 10, sort = "userName") Pageable pageable){
        return ResponseEntity.ok(new PageResponse<>(employeeService.findWorcationAppliesList(companyNo,pageable)));
    }

    //회사 직원 수 조회
    @GetMapping("/employees-summary/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<CompanyProfileDto.Employees> getEmployeesNumber(@PathVariable Long companyNo){
        return ResponseEntity.ok(employeeService.findEmployeesNumber(companyNo));
    }

    //회사 직원 승인 상태 변경
    @PatchMapping("/applies/{userNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<String> updateStatus(@PathVariable Long userNo, @RequestBody Map<String, String> request ){
        String status = request.get("status"); // 'Y' 또는 'N'
        employeeService.updateApproveStatus(userNo, status);
        return ResponseEntity.ok().build();
    }

    //회사 직원 워케이션 신청 상태 변경
    @PatchMapping("/worcation-applies/{userNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<String> updateWorcationStatus(@PathVariable Long userNo, @RequestBody Map<String, String> request ){
        String status = request.get("status");
        employeeService.updateWorcationStatus(userNo,status);
        return ResponseEntity.ok().build();
    }

    //회사 직원 워케이션 캘린더 조회
    @GetMapping("/worcation-calendar/{companyNo}")
    @PreAuthorize("hasRole('MASTER') OR hasRole('MANAGER')")
    public ResponseEntity<List<CompanyProfileDto.Calendar>> getWorcationCalendar(@PathVariable Long companyNo){
        return  ResponseEntity.ok(employeeService.getWorcationCalendar(companyNo));
    }
}
