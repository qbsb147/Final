package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Health;

import com.minePing.BackEnd.entity.Member;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRepository extends JpaRepository<Health, Long>, HealthRepositoryV1 {
    List<Health> findByMember_UserNo(Long userNo);
    Optional<Health> findByMember_UserId(String userId);

    Optional<Health> findTopByMember_UserNoOrderByUpdateDateDesc(Long userNo);

    Health findByMemberAndUpdateDateAfter(Member member, LocalDate updateDateAfter);
}