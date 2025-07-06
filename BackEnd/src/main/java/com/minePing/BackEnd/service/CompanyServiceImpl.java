package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyDto;
import com.minePing.BackEnd.dto.DepartmentDto;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.CompanyRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.minePing.BackEnd.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;

/*
    @Override
    public List<CompanyDto.Search> findByCompanyNameContainingAndStatus(String company_name) {
        return companyRepository.findByCompanyNameContainingAndStatus(company_name, CommonEnums.Status.Y)
                .map(company -> company.stream()
                        .map(CompanyDto.Search::toDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
*/

    @Override
    public List<CompanyDto.Search> getCompanyList(String company_name) {
        return companyRepository.findByCompanyNameContainingAndStatus(company_name, CommonEnums.Status.Y)
                                .map(company -> company.stream()
                                        .map(CompanyDto.Search::toDto)
                                        .collect(Collectors.toList()))
                                .orElse(Collections.emptyList());
    }

    @Override
    public List<DepartmentDto.Response> getDepartmentList(Long company_no) {
        return departmentRepository.findAllByCompany_CompanyNo(company_no)
                .map(department -> department.stream()
                        .map(DepartmentDto.Response::toDto)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
}
