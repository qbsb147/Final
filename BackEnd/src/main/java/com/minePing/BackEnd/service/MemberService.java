package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.MemberInfoResponse;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums.Role;
import com.minePing.BackEnd.enums.SocialType;

public interface MemberService {
    MemberDto.init init();
    void createEmployeeMember(MemberDto.EmployeeJoin employeeJoinDto);
    void createMasterMember(MemberDto.MasterJoin masterJoinDto);
    void createWorcationMember(MemberDto.WorcationJoin worcationJoinDto);
    String login(MemberDto.Login loginDto);

    void updateRole(Long userNo,MemberDto.UpdateRole updateRoleDto);

    MemberDto.InfoResponse getUserInfoByUserId();
    MemberInfoResponse getUserByUserId();
    MemberDto.LoginResponse getMemberBySocialId(String socialId);
    Member createOauth(String socialId, String email, String name, SocialType socialType);

    void checkPassword(String password);
    void updateUser(MemberDto.Update updateDto);
    void delete();
}
