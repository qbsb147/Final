package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

/*
    @Query("select d.departmentNo, d.departmentName from Department d where d.company.companyNo =:company_no")
    Optional<List<Department>> findAllByCompanyNo(@Param("company_no") Long company_no);
*/
    Optional<List<Department>> findAllByCompany_CompanyNo(Long companyNo);

}
