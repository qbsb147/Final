package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.service.ApplicationService;
import java.time.LocalDate;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getAllApplications() {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getAllApplications();
        return ResponseEntity.ok(list);
    }

    //  단일 신청 조회 (본인 또는 관리자)
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationDto.ApplicationResponseDto> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplication(id));
    }

    //  신청 등록
    @PostMapping
    @PreAuthorize("!hasRole('ROLE_WORCATION')")
    public ResponseEntity<ApplicationDto.ApplicationResponseDto> createApplication(
            @RequestBody ApplicationDto.ApplicationRequestDto requestDto
    ) {
        ApplicationDto.ApplicationResponseDto responseDto = applicationService.createApplication(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    //  신청 삭제 (본인 또는 관리자)
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    //워케이션 업체 별 신청 현황
    @GetMapping("/reserved_by_worcation")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApplicationDto.ReservedResponseDto>> getReservedByWorcation(
            @RequestParam Long worcationNo) {
        List<ApplicationDto.ReservedResponseDto> list = applicationService.getReservedByWorcation(worcationNo);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/full_dates")
    public ResponseEntity<Map<LocalDate, Boolean>> getFullDates(
            @RequestParam Long worcationNo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        Map<LocalDate, Boolean> result = applicationService.getFullyReservedDates(worcationNo, start, end);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reserved-worcation")
    public ResponseEntity<List<LocalDate>> getFullDates(
            @RequestParam Long worcationNo,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        List<LocalDate> fullDates = applicationService.getFullDates(worcationNo, startDate, endDate);
        return ResponseEntity.ok(fullDates);
    }

    @GetMapping("/remaining")
    public ResponseEntity<List<ApplicationDto.RemainingDto>> getRemainingByWorcation(
            @RequestParam Long worcationNo,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        List<ApplicationDto.RemainingDto> result = applicationService.getRemainingByWorcation(worcationNo, startDate, endDate);
        return ResponseEntity.ok(result);
    }


    /**
     *
     * 예약 확인
     */

    // 예약 확인 (본인만)
    @GetMapping("/reserved")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getReserved(@RequestParam Long userNo) {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getReservedByUser(userNo);
        return ResponseEntity.ok(list);
    }

    /**
     *
     * 지난 예약 정보 확인(날짜 기반)
     */
    // 지난 예약 정보 확인 (본인만)
    @GetMapping("/used")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getUsed(@RequestParam Long userNo) {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getUsedByUser(userNo);
        return ResponseEntity.ok(list);
    }
}
