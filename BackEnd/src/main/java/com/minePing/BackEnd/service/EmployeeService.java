package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyProfileDto;
import java.util.List;


public interface EmployeeService {

    List<CompanyProfileDto.Response> findAllMember(Long companyNo);
}
