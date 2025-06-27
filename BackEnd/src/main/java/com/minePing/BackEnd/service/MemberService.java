package com.minePing.BackEnd.service;


import com.minePing.BackEnd.dto.MemberDto;

public interface MemberService {
    void saveEmployee(MemberDto.EmployeeJoin employeeJoinDto);
    void saveMaster(MemberDto.MasterJoin masterJoinDto);
    void saveWorcation(MemberDto.WorcationJoin worcationJoinDto);
    void login(MemberDto.Login loginDto);
}
