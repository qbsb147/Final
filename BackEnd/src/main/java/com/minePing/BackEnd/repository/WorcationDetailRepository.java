package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorcationDetailRepository extends JpaRepository<WorcationDetail, Long> {
    
    // 워케이션 번호로 상세 정보 조회
    Optional<WorcationDetail> findByWorcation_WorcationNo(Long worcationNo);
    
    // 특정 지역의 워케이션 상세 정보 조회
    @Query("SELECT wd FROM WorcationDetail wd " +
           "JOIN wd.worcation w " +
           "WHERE w.worcationAddress LIKE %:area%")
    List<WorcationDetail> findByArea(@Param("area") String area);
}
