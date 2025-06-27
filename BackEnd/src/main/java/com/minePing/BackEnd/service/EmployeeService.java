package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MemberDto;
import java.util.List;


public interface EmployeeService {

    List<MemberDto.Response> findAllMember(Long companyNo);
}
