package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationApplication;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class WorcationRepositoryImpl implements WorcationRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<WorcationApplication> findByWorcationNosAndDate(List<Long> worcationNos, LocalDate today, Pageable pageable) {
        String jpql = """
        SELECT wa
        FROM WorcationApplication wa
        JOIN wa.member m
        JOIN m.companyProfile cp
        JOIN cp.company c
        JOIN wa.worcation w
        WHERE w.worcationNo IN :worcationNos
          AND wa.approve = com.minePing.BackEnd.enums.CommonEnums.Approve.Y
          AND ((wa.startDate <= :today AND wa.endDate >= :today) OR wa.startDate > :today)
        ORDER BY m.name ASC
    """;

        TypedQuery<WorcationApplication> query = em.createQuery(jpql, WorcationApplication.class);
        query.setParameter("worcationNos", worcationNos);
        query.setParameter("today", today);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<WorcationApplication> content = query.getResultList();

        String countJpql = """
        SELECT COUNT(wa)
        FROM WorcationApplication wa
        JOIN wa.worcation w
        WHERE w.worcationNo IN :worcationNos
          AND wa.approve = com.minePing.BackEnd.enums.CommonEnums.Approve.Y
          AND ((wa.startDate <= :today AND wa.endDate >= :today) OR wa.startDate > :today)
    """;

        Long total = em.createQuery(countJpql, Long.class)
                .setParameter("worcationNos", worcationNos)
                .setParameter("today", today)
                .getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
}
