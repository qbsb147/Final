package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.auth.JwtTokenProvider;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signUp/EMPLOYEE")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.EmployeeJoin employeeJoinDto) {
        memberService.createEmployeeMember(employeeJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signUp/MASTER")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.MasterJoin masterJoinDto) {
        memberService.createMasterMember(masterJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/signUp/WORCATION")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.WorcationJoin worcationJoinDto) {
        memberService.createWorcationMember(worcationJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto.Login loginDto) {
        MemberDto.LoginResponse member = memberService.login(loginDto);

        String jwtToken = jwtTokenProvider.createToken(member.getUser_id(), member.getRole());
        Map<String, Object> loginInfo = new HashMap<>();
        loginInfo.put("token", jwtToken);
        return new ResponseEntity<>(loginInfo, HttpStatus.OK);
    }
}
