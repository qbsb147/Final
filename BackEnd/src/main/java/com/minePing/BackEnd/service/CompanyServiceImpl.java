package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyDto;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.CompanyRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;

    @Override
    public List<CompanyDto.Search> getCompanyList(String company_name) {
        return companyRepository.findByCompanyName(company_name, CommonEnums.Status.Y)
                                .map(company -> company.stream()
                                        .map(CompanyDto.Search::toDto)
                                        .collect(Collectors.toList()))
                                .orElse(Collections.emptyList());
    }
}
