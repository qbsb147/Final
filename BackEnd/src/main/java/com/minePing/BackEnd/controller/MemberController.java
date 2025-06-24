package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
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

    @PostMapping("/signUp/employee")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.EmployeeJoin employeeJoinDto) {

        return ResponseEntity.ok().build();
    }

    @PostMapping("/signUp/master")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.MasterJoin masterJoinDto) {

        return ResponseEntity.ok().build();
    }

    @PostMapping("/signUp/worcation")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.WorcationJoin worcationJoinDto) {

        return ResponseEntity.ok().build();
    }

    @GetMapping("/approve/employee/{user_no}")
    public ResponseEntity<Void> approveEmployee(@PathVariable Long user_no) {

        return ResponseEntity.ok().build();
    }
}
