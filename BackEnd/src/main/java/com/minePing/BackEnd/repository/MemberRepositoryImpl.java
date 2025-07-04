package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Company;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import com.minePing.BackEnd.enums.CommonEnums.Status;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class MemberRepositoryImpl implements MemberRepositoryV1 {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Member> findMasterInfoByUserId(String userId) {
        String query = "select m from Member m join fetch m.company where m.userId = :userId and m.status = :status";
        Member member = em.createQuery(query, Member.class)
                .setParameter("userId", userId)
                .setParameter("status", Status.Y)
                .getSingleResult();
        return Optional.ofNullable(member);
    }

    @Override
    public Optional<Member> findEmployeeInfoByUserId(String userId) {
        String query = "select m from Member m join fetch m.companyProfile join fetch m.company where m.userId = :userId and m.status = :status";
        Member member = em.createQuery(query, Member.class)
                .setParameter("userId", userId)
                .setParameter("status", Status.Y)
                .getSingleResult();
        return Optional.ofNullable(member);
    }

    @Override
    public Optional<Member> findWorcationInfoByUserId(String userId) {
        String query = "select m from Member m where m.userId = :userId and m.status = :status";
        Member member = em.createQuery(query, Member.class)
                .setParameter("userId", userId)
                .setParameter("status", Status.Y)
                .getSingleResult();
        return Optional.ofNullable(member);

    }
}
