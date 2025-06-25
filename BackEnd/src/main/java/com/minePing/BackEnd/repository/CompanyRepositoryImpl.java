package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.dto.CompanyDto.Search;
import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class CompanyRepositoryImpl implements CompanyRepositoryV1 {
    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<List<Company>> findByCompanyName(String company_name, CommonEnums.Status status) {
        String query = "SELECT c FROM Company c WHERE c.companyName LIKE :company_name AND c.status =:status";
        List<Company> companyList = em.createQuery(query, Company.class)
                .setParameter("company_name", "%"+company_name+"%")
                .setParameter("status", status)
                .getResultList();
        return Optional.ofNullable(companyList);
    }
}
