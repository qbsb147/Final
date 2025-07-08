package com.minePing.BackEnd.controller;

import com.minePing.BackEnd.dto.AccessTokenDto;
import com.minePing.BackEnd.dto.KakaoProfileDto;
import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.InfoResponse;
import com.minePing.BackEnd.service.KakaoService;
import com.minePing.BackEnd.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final KakaoService kakaoService;

    @GetMapping("/signUp/init")
    public ResponseEntity<Void> init() {
        memberService.init();
        return ResponseEntity.ok().build();
    }

    @PostMapping("signUp/EMPLOYEE")
    public ResponseEntity<Void> singUp(@Valid @RequestBody MemberDto.EmployeeJoin employeeJoinDto) {
        memberService.createEmployeeMember(employeeJoinDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("signUp/MASTER")
    public ResponseEntity<Void> singUp(@Valid @RequestBody MemberDto.MasterJoin masterJoinDto) {
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
        return ResponseEntity.ok(loginInfo);
    }

    @GetMapping("userInfo")
    public ResponseEntity<InfoResponse> getMyInfo() {
        InfoResponse userInfo = memberService.getUserInfoByUserId();
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("")
    public ResponseEntity<?> getUser() {
        MemberDto.MemberInfoResponse user = memberService.getUserByUserId();
        return ResponseEntity.ok(user);
    }

    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody MemberDto.Update updateDto){
        memberService.updateUser(updateDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("")
    public ResponseEntity<Void> delete(){
        memberService.delete();
        return ResponseEntity.ok().build();
    }

    @PostMapping("kakao/login")
    public ResponseEntity<?> kakaoLogin(@RequestBody MemberDto.KakaoLogin kakaoLoginDto) {
        AccessTokenDto accessTokenDto = kakaoService.getAccessToken(kakaoLoginDto.getCode());
        KakaoProfileDto kakaoProfileDto = kakaoService.getKakaoProfile(accessTokenDto.getAccess_token());
//        Member member = memberService.getMemberBySocialId(kakaoProfileDto.getId());

        return ResponseEntity.ok(null);
    }


    @PostMapping("validate-password")
    public ResponseEntity<Void> checkPassword(@RequestBody Map<String, String> body){
        String password = body.get("password");
        memberService.checkPassword(password);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{userNo}")
    public ResponseEntity<String> updateRole(@PathVariable Long userNo,@RequestBody MemberDto.UpdateRole updateRoleDto) {
        try {
            memberService.updateRole(userNo,updateRoleDto);
            return ResponseEntity.ok("등급 변경 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("등급 변경 중 오류가 발생했습니다.");
        }
    }
}
