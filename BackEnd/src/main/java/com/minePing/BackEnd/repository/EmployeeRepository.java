package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Member, Long>, EmployeeRepositoryV1 {
    List<Member> findAllByCompany_CompanyNo(Long companyNo);
}
