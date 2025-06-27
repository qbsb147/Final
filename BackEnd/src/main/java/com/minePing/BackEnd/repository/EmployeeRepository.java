package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<CompanyProfile, Long>, EmployeeRepositoryV1 {
    List<CompanyProfile> findAllByCompany_CompanyNo(Long companyNo);
}
