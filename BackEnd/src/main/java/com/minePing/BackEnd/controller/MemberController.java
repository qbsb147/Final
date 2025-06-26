package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signUp/employee")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.EmployeeJoin employeeJoinDto) {
        System.out.println("employeeJoinDto = " + employeeJoinDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signUp/master")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.MasterJoin masterJoinDto) {
        System.out.println("masterJoinDto = " + masterJoinDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/signUp/worcation")
    public ResponseEntity<Void> singUp(@RequestBody MemberDto.WorcationJoin worcationJoinDto) {
        System.out.println("worcationJoinDto = " + worcationJoinDto.toString());
        return ResponseEntity.ok().build();
    }

}
