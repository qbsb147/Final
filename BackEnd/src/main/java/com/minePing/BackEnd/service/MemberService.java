package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.MemberInfoResponse;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums.Role;
import com.minePing.BackEnd.enums.SocialType;

public interface MemberService {
    void createEmployeeMember(MemberDto.EmployeeJoin employeeJoinDto);
    void createMasterMember(MemberDto.MasterJoin masterJoinDto);
    void createWorcationMember(MemberDto.WorcationJoin worcationJoinDto);
    MemberDto.LoginResponse login(MemberDto.Login loginDto);

    void updateRole(Long userNo,MemberDto.UpdateRole updateRoleDto);

    MemberDto.InfoResponse getUserInfoByUserId(String userId);
    MemberInfoResponse getMyPageByUserId(String userId, Role role);
    MemberDto.LoginResponse getMemberBySocialId(String socialId);
    Member createOauth(String socialId, String email, String name, SocialType socialType);

    void updateMember(MemberDto.Update updateDto);
}
