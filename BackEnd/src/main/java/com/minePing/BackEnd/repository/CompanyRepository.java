package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.dto.CompanyDto.Search;
import com.minePing.BackEnd.entity.Company;
import java.util.List;
import java.util.Optional;

import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Long>, CompanyRepositoryV1 {
    Optional<List<Company>> findByCompanyNameContainingAndStatus(String company_name, CommonEnums.Status status);
/*
    @Query("SELECT c FROM Company c WHERE c.companyName LIKE %:companyName% AND c.status = :status")
    Optional<List<Company>> findByCompanyName(@Param("companyName") String company_name, @Param("status") CommonEnums.Status status);

*/
    @Query("select c.companyNo from Company c where c.member.userNo = :userNo and c.status = :status")
    Optional<Long> getCompanyNoByUserNo(@Param("userNo") Long user_no, CommonEnums.Status status);

    Company findByCompanyNoAndStatus(Long companyNo, CommonEnums.Status status);
}
