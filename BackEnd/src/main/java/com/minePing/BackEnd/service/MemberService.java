package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.MemberInfoResponse;

import java.io.IOException;

public interface MemberService {
    MemberDto.init init();
    void createEmployeeMember(MemberDto.EmployeeJoin employeeJoinDto);
    void createMasterMember(MemberDto.MasterJoin masterJoinDto);
    void createWorcationMember(MemberDto.WorcationJoin worcationJoinDto);
    String login(MemberDto.Login loginDto) throws IOException;
    void logout();

    String updateRole(Long userNo,MemberDto.UpdateRole updateRoleDto);

    MemberDto.InfoResponse getUserInfoByUserId();
    MemberInfoResponse getUserByUserId();

    void checkPassword(String password);
    void updateUser(MemberDto.Update updateDto);
    void delete();
    void sendVerificationCode(String email);

    boolean verifyCode(String email, String code);
}
