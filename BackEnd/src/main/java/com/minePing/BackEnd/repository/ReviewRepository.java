package com.minePing.BackEnd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.minePing.BackEnd.entity.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
    
    // 워케이션별 리뷰 조회 (JOIN FETCH로 성능 최적화)
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.worcationApplication wa " +
           "LEFT JOIN FETCH wa.worcation w " +
           "WHERE w.worcationNo = :worcationNo")
    List<Review> findByWorcationNo(@Param("worcationNo") Long worcationNo);
    
    // 특정 사용자의 리뷰 조회
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.worcationApplication wa " +
           "LEFT JOIN FETCH wa.worcation w " +
           "WHERE r.writerId = :writerId")
    List<Review> findByWriterId(@Param("writerId") String writerId);
    
    // 최근 리뷰 조회 (최신순)
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.worcationApplication wa " +
           "LEFT JOIN FETCH wa.worcation w " +
           "ORDER BY r.createAt DESC")
    List<Review> findAllOrderByCreateAtDesc();
    
    // 평점이 높은 리뷰 조회 (평점 시스템이 있다면)
    @Query("SELECT r FROM Review r " +
           "LEFT JOIN FETCH r.worcationApplication wa " +
           "LEFT JOIN FETCH wa.worcation w " +
           "WHERE wa.worcation.worcationNo = :worcationNo " +
           "ORDER BY r.createAt DESC")
    List<Review> findByWorcationNoOrderByCreateAtDesc(@Param("worcationNo") Long worcationNo);
}
