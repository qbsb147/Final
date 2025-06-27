package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.MemberDto;
import com.minePing.BackEnd.dto.MemberDto.Response;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.repository.EmployeeRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;


    @Override
    public List<Response> findAllMember(Long companyNo) {
        return employeeRepository.findAllByCompany_CompanyNo(companyNo).stream()
                .map(member -> {
                    String workStatus = calculateWorkStatus(member);
                    return MemberDto.Response.toDto(member, workStatus);
                })
                .collect(Collectors.toList());
    }

    private String calculateWorkStatus(Member member) {
        LocalDate today = LocalDate.now();
        return member.getWorcationApplications().stream()
                .filter(app -> app.getApprove() == CommonEnums.Approve.Y)
                .anyMatch(app -> !today.isBefore(app.getStartDate()) && !today.isAfter(app.getEndDate()))
                ? "워케이션 중" : "근무 중";
    }
}
