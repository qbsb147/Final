package com.minePing.BackEnd.service;

import com.minePing.BackEnd.dto.CompanyProfileDto;
import com.minePing.BackEnd.dto.CompanyProfileDto.Response;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface EmployeeService {

    Page<CompanyProfileDto.Response> findAllMember(Long companyNo, Pageable pageable);


    List<CompanyProfileDto.Approval> findgetApprovalList(Long companyNo);

    Page<CompanyProfileDto.Consult> findConsultList(Long companyNo, Pageable pageable);

    Page<CompanyProfileDto.Applies> findWorcationAppliesList(Long companyNo, Pageable pageable);

    CompanyProfileDto.Employees findEmployeesNumber(Long companyNo);

    void updateApproveStatus(Long userNo, String status);

    void updateWorcationStatus(Long userNo, String status);

    List<CompanyProfileDto.Calendar> getWorcationCalendar(Long companyNo);
}
