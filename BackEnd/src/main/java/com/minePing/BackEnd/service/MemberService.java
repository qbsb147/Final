package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MemberDto;

public interface MemberService {
    void createEmployeeMember(MemberDto.EmployeeJoin employeeJoinDto);
    void createMasterMember(MemberDto.MasterJoin masterJoinDto);
    void createWorcationMember(MemberDto.WorcationJoin worcationJoinDto);
    MemberDto.LoginResponse login(MemberDto.Login loginDto);
    void updateRole(Long userNo,MemberDto.UpdateRole updateRoleDto) throws Exception;
}
