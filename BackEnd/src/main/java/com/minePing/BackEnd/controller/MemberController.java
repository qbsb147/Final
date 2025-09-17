package com.minePing.BackEnd.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minePing.BackEnd.dto.MailVerificationRequestDto;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.InfoResponse;
import com.minePing.BackEnd.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;

@Slf4j
@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final ObjectMapper objectMapper;

    @GetMapping("/signUp/init")
    public ResponseEntity<MemberDto.init> init() {
        MemberDto.init memberDto = memberService.init();
        System.out.println("memberDto = " + memberDto);
        return ResponseEntity.ok(memberDto);
    }

    @PostMapping("signUp/EMPLOYEE")
    public ResponseEntity<Void> singUp(@Valid @RequestBody MemberDto.EmployeeJoin employeeJoinDto) {
        memberService.createEmployeeMember(employeeJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("signUp/MASTER")
    public ResponseEntity<Long> singUp(@Valid @RequestBody MemberDto.MasterJoin masterJoinDto) throws JsonProcessingException {
        String json = objectMapper.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(masterJoinDto);
        log.debug("json = \n{}",json);
        System.out.println("masterJoinDto = " + masterJoinDto.getMasterProfileJoinDto().getCompany_phone());
        memberService.createMasterMember(masterJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("signUp/WORCATION")
    public ResponseEntity<Void> singUp(@Valid @RequestBody MemberDto.WorcationJoin worcationJoinDto) {
        memberService.createWorcationMember(worcationJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@Valid @RequestBody MemberDto.Login loginDto) {
        Map<String, Object> loginInfo = new HashMap<>();
        String jwtToken = memberService.login(loginDto);
        loginInfo.put("token", jwtToken);
        return ResponseEntity.ok()
                .header("Set-Cookie", String.format(
                        "token=%s; Path=/; HttpOnly; Secure=true; SameSite=Strict",
                        jwtToken
                ))
                .build();
    }

    @GetMapping("logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header("Set-Cookie",
                "token=; Path=/; HttpOnly; Secure=true; SameSite=Strict; Max-Age=0"
                )
                .build();
    }

    @GetMapping("userInfo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InfoResponse> getMyInfo() {
        InfoResponse userInfo = memberService.getUserInfoByUserId();
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUser() {
        MemberDto.MemberInfoResponse user = memberService.getUserByUserId();
        return ResponseEntity.ok(user);
    }

    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> update(@RequestBody MemberDto.Update updateDto){
        memberService.updateUser(updateDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(){
        memberService.delete();
        return ResponseEntity.ok().build();
    }

    @PostMapping("validate-password")
    public ResponseEntity<Void> checkPassword(@RequestBody Map<String, String> body){
        String password = body.get("password");
        memberService.checkPassword(password);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{userNo}")
    @PreAuthorize("hasRole('ROLE_MASTER')")
    public ResponseEntity<String> updateRole(@PathVariable Long userNo,@RequestBody MemberDto.UpdateRole updateRoleDto) {
        try {
            String jwt = memberService.updateRole(userNo,updateRoleDto);
            return ResponseEntity.ok(jwt);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("등급 변경 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/send_code")
    public ResponseEntity<?> sendCode(@RequestBody MailVerificationRequestDto.Send request) {
        try {
            memberService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok().body(Map.of("message", "인증 코드가 발송되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "메일 전송 실패", "detail", e.getMessage()));
        }
    }

    @PostMapping("verify_code")
    public ResponseEntity<String> verifyCode(@RequestBody MailVerificationRequestDto.Verify request) {
        if (memberService.verifyCode(request.getEmail(), request.getCode())) {
            return ResponseEntity.ok("인증이 완료되었습니다.");
        }
        return ResponseEntity.badRequest().body("인증코드가 올바르지 않거나 만료되었습니다.");
    }}
