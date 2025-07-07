package com.minePing.BackEnd.repository;


import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.MentalEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.Optional;
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
          AND cp.approve = :cpApprove
          AND (wa.approve IN :waApproves OR wa IS NULL)
    """;

        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("cpApprove", CommonEnums.Approve.Y)
                .setParameter("waApproves", List.of(
                        CommonEnums.Approve.Y,  // 승인
                        CommonEnums.Approve.W,   // 대기
                        CommonEnums.Approve.N
                ))
                .getResultList();
    }

    @Override
    public List<CompanyProfile> findAllApprovalByCompanyNoAndApproveN(Long companyNo) {
        String query = "SELECT cp FROM CompanyProfile cp JOIN FETCH cp.member m WHERE cp.company.companyNo = :companyNo AND cp.approve = :approve";
        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("approve", CommonEnums.Approve.W)
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
    public List<CompanyProfile> findallWorcationAppliesByCompanyNo(Long companyNo) {
        String query = """
        SELECT DISTINCT cp FROM CompanyProfile cp
        JOIN FETCH cp.member m
        JOIN FETCH m.worcationApplications wa
        JOIN FETCH wa.worcation w
        WHERE cp.company.companyNo = :companyNo
          AND cp.approve = :cpApprove
          AND wa.approve = :waApprove
    """;

        return em.createQuery(query, CompanyProfile.class)
                .setParameter("companyNo", companyNo)
                .setParameter("cpApprove", CommonEnums.Approve.Y)  // 직원 승인
                .setParameter("waApprove", CommonEnums.Approve.W)  // 워케이션 승인 대기
                .getResultList();
    }

    @Override
    public int countWorcationInProgressByCompanyNo(Long companyNo, LocalDate today) {
        String jpql = """
        SELECT COUNT(DISTINCT m.userNo)
        FROM CompanyProfile cp
        JOIN cp.member m
        JOIN m.worcationApplications wa
        WHERE cp.company.companyNo = :companyNo
          AND cp.approve = :cpApprove
          AND wa.approve = :waApprove
          AND wa.startDate <= :today
          AND wa.endDate >= :today
    """;

        Long count = em.createQuery(jpql, Long.class)
                .setParameter("companyNo", companyNo)
                .setParameter("cpApprove", CommonEnums.Approve.Y) // 직원 승인된 경우만
                .setParameter("waApprove", CommonEnums.Approve.Y) // 워케이션 승인된 경우만
                .setParameter("today", today)
                .getSingleResult();

        return count.intValue();
    }

    @Override
    public Optional<WorcationApplication> findWorcationApplicationByUserNo(Long userNo) {
        String jpql = "SELECT wa FROM WorcationApplication wa JOIN wa.member m WHERE m.userNo = :userNo";
        List<WorcationApplication> results = em.createQuery(jpql, WorcationApplication.class)
                .setParameter("userNo", userNo)
                .getResultList();

        if (results.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(results.get(0));
    }

    @Override
    public List<WorcationApplication> findApprovedWorcationApplications(Long companyNo) {
        String jpql = """
        SELECT wa FROM WorcationApplication wa
        JOIN FETCH wa.member m
        JOIN FETCH m.companyProfile cp
        JOIN FETCH wa.worcation w
        WHERE cp.company.companyNo = :companyNo
        AND wa.approve = com.minePing.BackEnd.enums.CommonEnums.Approve.Y
    """;

        return em.createQuery(jpql, WorcationApplication.class)
                .setParameter("companyNo", companyNo)
                .getResultList();
    }
}
