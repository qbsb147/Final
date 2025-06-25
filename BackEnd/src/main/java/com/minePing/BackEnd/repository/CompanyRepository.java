package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.dto.CompanyDto.Search;
import com.minePing.BackEnd.entity.Company;
import java.util.List;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long>, CompanyRepositoryV1 {
}
