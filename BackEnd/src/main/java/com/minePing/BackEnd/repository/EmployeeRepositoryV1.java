package com.minePing.BackEnd.repository;


import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.WorcationApplication;
import java.util.List;
import java.util.Optional;


public interface EmployeeRepositoryV1 {
    List<CompanyProfile> findAllByCompanyNo(Long companyNo);
    List<CompanyProfile> findAllApprovalByCompanyNoAndApproveN(Long companyNo);
    List<CompanyProfile> findAllConsultByCompanyNo(Long companyNo);
    List<CompanyProfile> findallWorcationAppliesByCompanyNo(Long companyNo);
    int countWorcationInProgressByCompanyNo(Long companyNo, java.time.LocalDate today);
    Optional<WorcationApplication> findWorcationApplicationByUserNo(Long userNo);
    List<WorcationApplication> findApprovedWorcationApplications(Long companyNo);

}
