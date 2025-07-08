package com.minePing.BackEnd.repository;


import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.WorcationApplication;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface EmployeeRepositoryV1 {
    Page<CompanyProfile> findAllByCompanyNo(Long companyNo, Pageable pageable);
    List<CompanyProfile> findAllApprovalByCompanyNoAndApproveN(Long companyNo);
    Page<CompanyProfile> findAllConsultByCompanyNo(Long companyNo, Pageable pageable);
    Page<CompanyProfile> findallWorcationAppliesByCompanyNo(Long companyNo, Pageable pageable);
    int countWorcationInProgressByCompanyNo(Long companyNo, java.time.LocalDate today);
    Optional<WorcationApplication> findWorcationApplicationByUserNo(Long userNo);
    List<WorcationApplication> findApprovedWorcationApplications(Long companyNo);
    int countAllByCompanyNo(Long companyNo);

}
