package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyDto;
import java.util.List;

public interface CompanyService {
    List<CompanyDto.Search> getCompanyList(String company_name);
}
