package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import com.minePing.BackEnd.enums.CommonEnums;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<WorcationApplication, Long> {

    // 로그인한 사용자의 예약된 신청 (시작일이 오늘 이후)
    @Query("SELECT wa FROM WorcationApplication wa " +
            "LEFT JOIN FETCH wa.member " +
            "LEFT JOIN FETCH wa.worcation w " +
            "LEFT JOIN FETCH w.worcationDetail " +
            "LEFT JOIN FETCH w.worcationFeatures " +
            "WHERE wa.member.userNo = :userNo AND wa.startDate > :today " +
            "ORDER BY wa.startDate ASC")
    List<WorcationApplication> getReservedByUser(@Param("userNo") Long userNo, @Param("today") LocalDate today);

    // 로그인한 사용자의 사용 완료된 신청 (종료일이 오늘 이전)
    @Query("SELECT wa FROM WorcationApplication wa " +
            "LEFT JOIN FETCH wa.member " +
            "LEFT JOIN FETCH wa.worcation w " +
            "LEFT JOIN FETCH w.worcationDetail " +
            "LEFT JOIN FETCH w.worcationFeatures " +
            "WHERE wa.member.userNo = :userNo AND wa.endDate < :today " +
            "ORDER BY wa.endDate DESC")
    List<WorcationApplication> getUsedByUser(@Param("userNo") Long userNo, @Param("today") LocalDate today);


    //워케이션 업체에서 startDate ~ endDate 사이에 승인 상태가 W, Y인 신청 건들을 조회하는 쿼리
    @Query("SELECT wa FROM WorcationApplication wa " +
            "WHERE wa.worcation.worcationNo = :worcationNo " +
            "AND wa.startDate <= :endDate AND wa.endDate >= :startDate " +
            "AND wa.approve IN :statuses")
    List<WorcationApplication> findInRangeWithStatus(
            @Param("worcationNo") Long worcationNo,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("statuses") List<CommonEnums.Approve> statuses
    );

    @Query("SELECT wa FROM WorcationApplication wa " +
            "WHERE wa.worcation.worcationNo = :worcationNo " +
            "AND wa.startDate <= :endDate AND wa.endDate >= :startDate")
    List<WorcationApplication> findByWorcationNoAndDateRange(
            @Param("worcationNo") Long worcationNo,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query(value = """
            SELECT wa FROM WorcationApplication wa
            WHERE wa.worcation.worcationNo = :worcationNo
            AND wa.startDate <= :endDate AND wa.endDate >= :startDate
            AND wa.approve IN :approves
        """)
    List<WorcationApplication> lockDateRangeForUpdate(
            @Param("worcationNo") Long worcationNo,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("approves") List<CommonEnums.Approve> approves
    );
}