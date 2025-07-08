package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class WorcationRepositoryImpl implements WorcationRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<WorcationApplication> findByUserNo(Long userNo, Pageable pageable) {
        String jpql = """
            SELECT wa
            FROM WorcationApplication wa
            JOIN FETCH wa.member m
            JOIN FETCH wa.worcation w
            JOIN FETCH m.company c
            JOIN FETCH m.companyProfile cp
            WHERE m.userNo = :userNo
              AND wa.endDate >= CURRENT_DATE
            ORDER BY m.name ASC
        """;

        TypedQuery<WorcationApplication> query = em.createQuery(jpql, WorcationApplication.class);
        query.setParameter("userNo", userNo);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<WorcationApplication> content = query.getResultList();

        String countJpql = """
            SELECT COUNT(wa)
            FROM WorcationApplication wa
            JOIN wa.member m
            WHERE m.userNo = :userNo
              AND wa.endDate >= CURRENT_DATE
        """;

        Long total = em.createQuery(countJpql, Long.class)
                .setParameter("userNo", userNo)
                .getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
}

