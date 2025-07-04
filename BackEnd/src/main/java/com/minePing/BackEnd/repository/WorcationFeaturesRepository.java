package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.WorcationEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorcationFeaturesRepository extends JpaRepository<WorcationFeatures, Long> {
    
    // 워케이션 번호로 특징 정보 조회
    Optional<WorcationFeatures> findByWorcation_WorcationNo(Long worcationNo);
    
    // 특정 카테고리의 워케이션 특징 조회
    @Query("SELECT wf FROM WorcationFeatures wf " +
           "JOIN wf.worcation w " +
           "WHERE w.worcationCategory = :category")
    List<WorcationFeatures> findByCategory(@Param("category") WorcationEnums.Category category);
    
    // 특정 활동이 가능한 워케이션 특징 조회
    @Query("SELECT wf FROM WorcationFeatures wf " +
           "WHERE wf.activities LIKE %:activity%")
    List<WorcationFeatures> findByActivity(@Param("activity") String activity);
}
