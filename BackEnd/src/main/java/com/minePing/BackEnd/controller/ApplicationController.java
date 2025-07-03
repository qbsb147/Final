package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    //  전체 신청 목록 조회
    @GetMapping
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getAllApplications() {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getAllApplications();
        return ResponseEntity.ok(list);
    }

    //  단일 신청 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto.ApplicationResponseDto> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplication(id));
    }

    //  신청 등록
    @PostMapping
    public ResponseEntity<ApplicationDto.ApplicationResponseDto> createApplication(
            @RequestBody ApplicationDto.ApplicationRequestDto requestDto
    ) {
        ApplicationDto.ApplicationResponseDto responseDto = applicationService.createApplication(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    //  신청 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    /**
     *
     * 예약 확인
     */

    @GetMapping("/reserved")
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getReserved(@RequestParam Long userNo) {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getReservedByUser(userNo);
        return ResponseEntity.ok(list);
    }

    /**
     *
     * 지난 예약 정보 확인(날짜 기반)
     */ 
    @GetMapping("/used")
    public ResponseEntity<List<ApplicationDto.ApplicationResponseDto>> getUsed(@RequestParam Long userNo) {
        List<ApplicationDto.ApplicationResponseDto> list = applicationService.getUsedByUser(userNo);
        return ResponseEntity.ok(list);
    }
}
