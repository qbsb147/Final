package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.ApplicationDto;
import com.minePing.BackEnd.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
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
}
