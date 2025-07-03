package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<WorcationApplication, Long> {
    
    // 사용자별 신청 조회
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.member.userNo = :userNo")
    List<WorcationApplication> findByUserNo(@Param("userNo") Long userNo);
    
    // 워케이션별 신청 조회
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.worcation.worcationNo = :worcationNo")
    List<WorcationApplication> findByWorcationNo(@Param("worcationNo") Long worcationNo);
    
    // 승인 상태별 신청 조회
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.approve = :approve")
    List<WorcationApplication> findByApprove(@Param("approve") CommonEnums.Approve approve);
    
    // 예약된 신청 조회 (시작일이 오늘 이후)
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.startDate > :today " +
           "ORDER BY wa.startDate ASC")
    List<WorcationApplication> findReservedApplications(@Param("today") LocalDate today);
    
    // 사용 완료된 신청 조회 (종료일이 오늘 이전)
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.endDate < :today " +
           "ORDER BY wa.endDate DESC")
    List<WorcationApplication> findUsedApplications(@Param("today") LocalDate today);
    
    // 특정 기간의 신청 조회
    @Query("SELECT wa FROM WorcationApplication wa " +
           "LEFT JOIN FETCH wa.member " +
           "LEFT JOIN FETCH wa.worcation w " +
           "LEFT JOIN FETCH w.worcationDetail " +
           "LEFT JOIN FETCH w.worcationFeatures " +
           "WHERE wa.startDate >= :startDate AND wa.endDate <= :endDate")
    List<WorcationApplication> findByDateRange(
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );
}