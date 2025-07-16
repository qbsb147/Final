package com.minePing.BackEnd.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/security-example")
public class MemberSecurityExampleController {

    // 1. 본인만 접근 가능 (userNo == 인증된 사용자 번호)
    @GetMapping("/my-page/{userNo}")
    @PreAuthorize("#userNo == authentication.principal.userNo")
    public ResponseEntity<String> myPage(@PathVariable Long userNo) {
        return ResponseEntity.ok("본인만 접근 가능: userNo=" + userNo);
    }

    // 2. 관리자만 접근 가능
    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminOnly() {
        return ResponseEntity.ok("관리자만 접근 가능");
    }

    // 3. 본인 또는 관리자만 접근 가능
    @GetMapping("/my-or-admin/{userNo}")
    @PreAuthorize("hasRole('ADMIN') or #userNo == authentication.principal.userNo")
    public ResponseEntity<String> myOrAdmin(@PathVariable Long userNo) {
        return ResponseEntity.ok("본인 또는 관리자만 접근 가능: userNo=" + userNo);
    }
} 