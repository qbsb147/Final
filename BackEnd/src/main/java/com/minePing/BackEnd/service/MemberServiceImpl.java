package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MemberDto.EmployeeJoin;
import com.minePing.BackEnd.dto.MemberDto.Login;
import com.minePing.BackEnd.dto.MemberDto.MasterJoin;
import com.minePing.BackEnd.dto.MemberDto.WorcationJoin;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {
    @Override
    public void saveEmployee(EmployeeJoin employeeJoinDto) {

    }

    @Override
    public void saveMaster(MasterJoin masterJoinDto) {

    }

    @Override
    public void saveWorcation(WorcationJoin worcationJoinDto) {

    }

    @Override
    public void login(Login loginDto) {

    }
}
