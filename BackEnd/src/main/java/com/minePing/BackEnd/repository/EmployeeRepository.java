package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<CompanyProfile, Long>, EmployeeRepositoryV1 {

}
