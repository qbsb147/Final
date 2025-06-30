package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyDto;
import com.minePing.BackEnd.dto.DepartmentDto;
import com.minePing.BackEnd.enums.CommonEnums;

import java.util.List;

public interface CompanyService {

    List<CompanyDto.Search> getCompanyList(String companyName);

    List<DepartmentDto.Search> getDepartmentList(Long company_no);
}
