package com.minePing.BackEnd.repository;


import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.MentalEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;


import java.util.List;


@Repository
public class EmployeeRepositoryImpl implements EmployeeRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<CompanyProfile> findAllByCompanyNo(Long companyNo) {
        String query = """
        SELECT DISTINCT cp FROM CompanyProfile cp
        JOIN FETCH cp.member m
        LEFT JOIN FETCH m.worcationApplications wa
        WHERE cp.company.companyNo = :companyNo
        AND (wa.approve = :approve OR wa IS NULL)
    """;

        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("approve", CommonEnums.Approve.Y)
                .getResultList();
    }

    @Override
    public List<CompanyProfile> findAllApprovalByCompanyNoAndApproveN(Long companyNo) {
        String query = "SELECT cp FROM CompanyProfile cp JOIN FETCH cp.member m WHERE cp.company.companyNo = :companyNo AND cp.approve = :approve";
        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("approve", CommonEnums.Approve.N)
                .getResultList();
    }

    @Override
    public List<CompanyProfile> findAllConsultByCompanyNo(Long companyNo) {
        String query = """
        SELECT DISTINCT cp FROM CompanyProfile cp
        JOIN FETCH cp.member m
        JOIN FETCH Mental mental ON mental.member.userNo = m.userNo
        WHERE cp.company.companyNo = :companyNo
        AND (mental.psychologicalState = :severe OR mental.psychologicalState = :critical)
    """;

        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("severe", MentalEnums.PsychologicalState.Severe)
                .setParameter("critical", MentalEnums.PsychologicalState.Critical)
                .getResultList();
    }

    @Override
    public List<CompanyProfile> findallWorcationAppliesByCompanNo(Long companyNo) {
        String query = """
                SELECT DISTINCT cp FROM CompanyProfile cp
                    JOIN FETCH cp.member m
                    JOIN FETCH m.worcationApplications wa
                    JOIN FETCH wa.worcation w
                    WHERE cp.company.companyNo = :companyNo
                    AND wa.approve = :approve
                """;
        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("approve", CommonEnums.Approve.W)
                .getResultList();
    }
}
