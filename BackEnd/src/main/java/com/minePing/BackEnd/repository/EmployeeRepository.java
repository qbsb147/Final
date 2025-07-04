package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<CompanyProfile, Long>, EmployeeRepositoryV1 {
    Optional<CompanyProfile> findByMember_UserNo(Long userNo);

}
