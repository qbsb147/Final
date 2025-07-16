package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.PartnerDto;
import com.minePing.BackEnd.dto.PartnerDto.PartnerApproveRequestDto;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.service.PartnerService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("api/v1/partner")
@RequiredArgsConstructor
@Validated
public class PartnerController {
    private final PartnerService partnerService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_MASTER') OR hasRole('ROLE_MANAGER')")
    public ResponseEntity<String> createApplication(@RequestBody PartnerDto requestDto) {
        partnerService.saveApplication(requestDto);
        return ResponseEntity.ok("신청 완료");
    }

    @GetMapping("/requset")
    @PreAuthorize("hasRole('ROLE_WORCATION')")
    public ResponseEntity<List<PartnerDto.Response>> getPartnerRequests(@RequestParam Long userNo) {
        List<PartnerDto.Response> list = partnerService.getRequestsByUser(userNo);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/approval")
    @PreAuthorize("hasRole('ROLE_WORCATION')")
    public ResponseEntity<List<PartnerDto.Response>> getApprovalRequests(@RequestParam Long userNo) {
        List<PartnerDto.Response> list = partnerService.getApprovalRequestsByUser(userNo);
        return ResponseEntity.ok(list);
    }
    @PutMapping("/{partnerNo}/approve")
    @PreAuthorize("hasRole('ROLE_WORCATION')")
    public ResponseEntity<PartnerDto.Response> updateApproveStatus(
            @PathVariable Long partnerNo,
            @RequestBody PartnerApproveRequestDto dto
    ) {
        WorcationPartner updated = partnerService.updateApproveStatus(partnerNo, dto);
        return ResponseEntity.ok(PartnerDto.Response.fromEntity(updated));
    }

}
