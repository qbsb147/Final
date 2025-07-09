package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.PartnerDto;
import com.minePing.BackEnd.service.PartnerService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/partner")
@RequiredArgsConstructor
@Validated
public class PartnerController {
    private final PartnerService partnerService;

    @PostMapping
    public ResponseEntity<String> createApplication(@RequestBody PartnerDto requestDto) {
        partnerService.saveApplication(requestDto);
        return ResponseEntity.ok("신청 완료");
    }

    @GetMapping("/requset")
    public ResponseEntity<List<PartnerDto.Response>> getPartnerRequests(@RequestParam Long userNo) {
        List<PartnerDto.Response> list = partnerService.getRequestsByUser(userNo);
        return ResponseEntity.ok(list);
    }
}
