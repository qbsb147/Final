package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Member, Long>, EmployeeRepositoryV1 {
    @Query("SELECT m FROM Member m JOIN m.companyProfile cp WHERE cp.company.companyNo = :companyNo")
    List<Member> findAllByCompany_CompanyNo(@Param("companyNo") Long companyNo);
}
