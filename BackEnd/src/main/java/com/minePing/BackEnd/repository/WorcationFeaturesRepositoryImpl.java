package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.MemberRecommand;
import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WorcationFeaturesRepositoryImpl implements WorcationFeaturesRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Page<Worcation> findAllFilter(MemberRecommand memberRecommand, Pageable pageable) {
        String query;
        List<Worcation> worcations;
        memberRecommand = em.merge(memberRecommand);
        if(memberRecommand.getBestFor() != null){
            query = """
                select wf.worcation
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and wf.dominantColor = :dominantColor
                and wf.spaceMood = :spaceMood
                and wf.bestFor = :bestFor
                and wf.accommodationType = :accommodationType
                and w.status = :status
            """;
            worcations = em.createQuery(query, Worcation.class)
                .setParameter("locationType", memberRecommand.getLocationType())
                .setParameter("dominantColor", memberRecommand.getDominantColor())
                .setParameter("spaceMood", memberRecommand.getSpaceMood())
                .setParameter("bestFor", memberRecommand.getBestFor())
                .setParameter("accommodationType", memberRecommand.getAccommodationType())
                .setParameter("status", CommonEnums.Status.Y)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
            if(worcations.size() >= 5) {
                String countQuery = """
                select count(wf)
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and wf.dominantColor = :dominantColor
                and wf.spaceMood = :spaceMood
                and wf.bestFor = :bestFor
                and wf.accommodationType = :accommodationType
                and w.status = :status
            """;
                Long total = em.createQuery(countQuery, Long.class)
                        .setParameter("locationType", memberRecommand.getLocationType())
                        .setParameter("dominantColor", memberRecommand.getDominantColor())
                        .setParameter("spaceMood", memberRecommand.getSpaceMood())
                        .setParameter("bestFor", memberRecommand.getBestFor())
                        .setParameter("accommodationType", memberRecommand.getAccommodationType())
                        .setParameter("status", CommonEnums.Status.Y)
                        .getSingleResult();
                return new PageImpl<>(worcations, pageable, total);
            }
        }
        if(memberRecommand.getSpaceMood() != null) {
            memberRecommand.bestForIsNull();
            query = """
            select wf.worcation
            from WorcationFeatures wf
            join wf.worcation w
            where wf.locationType = :locationType
            and wf.dominantColor = :dominantColor
            and wf.spaceMood = :spaceMood
            and wf.accommodationType = :accommodationType
            and w.status = :status
        """;
            worcations = em.createQuery(query, Worcation.class)
                    .setParameter("locationType", memberRecommand.getLocationType())
                    .setParameter("dominantColor", memberRecommand.getDominantColor())
                    .setParameter("spaceMood", memberRecommand.getSpaceMood())
                    .setParameter("accommodationType", memberRecommand.getAccommodationType())
                    .setParameter("status", CommonEnums.Status.Y)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(pageable.getPageSize())
                    .getResultList();
            if (worcations.size() >= 5) {
                String countQuery = """
                select count(wf)
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and wf.dominantColor = :dominantColor
                and wf.spaceMood = :spaceMood
                and wf.accommodationType = :accommodationType
                and w.status = :status
            """;
                Long total = em.createQuery(countQuery, Long.class)
                        .setParameter("locationType", memberRecommand.getLocationType())
                        .setParameter("dominantColor", memberRecommand.getDominantColor())
                        .setParameter("spaceMood", memberRecommand.getSpaceMood())
                        .setParameter("accommodationType", memberRecommand.getAccommodationType())
                        .setParameter("status", CommonEnums.Status.Y)
                        .getSingleResult();
                return new PageImpl<>(worcations, pageable, total);
            }
        }
        if(memberRecommand.getAccommodationType() != null) {
            memberRecommand.spaceMoodIsNull();
            query = """
            select wf.worcation
            from WorcationFeatures wf
            join wf.worcation w
            where wf.locationType = :locationType
            and wf.dominantColor = :dominantColor
            and wf.accommodationType = :accommodationType
            and w.status = :status
        """;
            worcations = em.createQuery(query, Worcation.class)
                    .setParameter("locationType", memberRecommand.getLocationType())
                    .setParameter("dominantColor", memberRecommand.getDominantColor())
                    .setParameter("accommodationType", memberRecommand.getAccommodationType())
                    .setParameter("status", CommonEnums.Status.Y)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(pageable.getPageSize())
                    .getResultList();
            if (worcations.size() >= 5) {
                String countQuery = """
                select count(wf)
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and wf.dominantColor = :dominantColor
                and wf.accommodationType = :accommodationType
                and w.status = :status
            """;
                Long total = em.createQuery(countQuery, Long.class)
                        .setParameter("locationType", memberRecommand.getLocationType())
                        .setParameter("dominantColor", memberRecommand.getDominantColor())
                        .setParameter("accommodationType", memberRecommand.getAccommodationType())
                        .setParameter("status", CommonEnums.Status.Y)
                        .getSingleResult();
                return new PageImpl<>(worcations, pageable, total);
            }
        }
        if(memberRecommand.getDominantColor() != null){
            memberRecommand.accommodationTypeIsNull();
            query = """
                select wf.worcation
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and wf.dominantColor = :dominantColor
                and w.status = :status
            """;
            worcations = em.createQuery(query, Worcation.class)
                    .setParameter("locationType", memberRecommand.getLocationType())
                    .setParameter("dominantColor", memberRecommand.getDominantColor())
                    .setParameter("status", CommonEnums.Status.Y)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(pageable.getPageSize())
                    .getResultList();
            if(worcations.size() >= 5) {
                String countQuery = """
                    select count(wf)
                    from WorcationFeatures wf
                    join wf.worcation w
                    where wf.locationType = :locationType
                    and wf.dominantColor = :dominantColor
                    and w.status = :status
                """;
                Long total = em.createQuery(countQuery, Long.class)
                        .setParameter("locationType", memberRecommand.getLocationType())
                        .setParameter("dominantColor", memberRecommand.getDominantColor())
                        .setParameter("status", CommonEnums.Status.Y)
                        .getSingleResult();
                return new PageImpl<>(worcations, pageable, total);
            }
        }
        memberRecommand.dominantColorIsNull();
        query = """
            select wf.worcation
            from WorcationFeatures wf
            join wf.worcation w
            where wf.locationType = :locationType
            and w.status = :status
        """;
        worcations = em.createQuery(query, Worcation.class)
                .setParameter("locationType", memberRecommand.getLocationType())
                .setParameter("status", CommonEnums.Status.Y)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        String countQuery = """
                select count(wf)
                from WorcationFeatures wf
                join wf.worcation w
                where wf.locationType = :locationType
                and w.status = :status
            """;
        Long total = em.createQuery(countQuery, Long.class)
                .setParameter("locationType", memberRecommand.getLocationType())
                .setParameter("status", CommonEnums.Status.Y)
                .getSingleResult();
        return new PageImpl<>(worcations, pageable, total);
    }
}
