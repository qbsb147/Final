package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/companyList")
    public ResponseEntity<List<CompanyDto.>> companyList() {

    }

    @PostMapping("/SingUp/")
    public Member SingUp(@RequestBody Member member) {

    }
}
