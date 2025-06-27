package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyProfileDto;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<CompanyProfileDto.Response> findAllMember(Long companyNo) {
        LocalDate today = LocalDate.now();

        return employeeRepository.findAllByCompany_CompanyNo(companyNo).stream()
                .map(companyProfile -> {
                    Member member = companyProfile.getMember();

                    // 워케이션 상태 계산
                    String workStatus = member.getWorcationApplications().stream()
                            .filter(app -> app.getApprove() == CommonEnums.Approve.Y)
                            .anyMatch(app -> !today.isBefore(app.getStartDate()) && !today.isAfter(app.getEndDate()))
                            ? "워케이션 중" : "근무 중";

                    // 나이 계산
                    int age = Period.between(member.getBirthday(), today).getYears();

                    return CompanyProfileDto.Response.toDto(member, workStatus, age);
                })
                .collect(Collectors.toList());
    }
}