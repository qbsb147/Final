package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class CompanyProfileRepositoryImpl implements CompanyProfileRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    public Optional<CompanyProfile> getCompanyNoAndApproveByUserNo(Long userNo){
        String query = "select c from CompanyProfile c where c.member.userNo = :userNo";
        CompanyProfile companyProfile = em.createQuery(query, CompanyProfile.class)
                .setParameter("userNo", userNo)
                .getSingleResult();
        return Optional.ofNullable(companyProfile);
    }
}
