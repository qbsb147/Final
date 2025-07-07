package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Health;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRepository extends JpaRepository<Health, Long>, HealthRepositoryV1 {
    List<Health> findByMember_UserNo(Long userNo);
    Optional<Health> findByMember_UserId(String userId);
}