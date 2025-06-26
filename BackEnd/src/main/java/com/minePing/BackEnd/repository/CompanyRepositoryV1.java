package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.dto.CompanyDto.Search;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.enums.CommonEnums;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface CompanyRepositoryV1 {
    Optional<List<Company>> findByCompanyName(String company_name, CommonEnums.Status status);
}
