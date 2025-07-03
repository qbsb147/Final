package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorcationPartnerRepository extends JpaRepository<WorcationPartner, Long> {
    
    List<WorcationPartner> findByWorcation(Worcation worcation);
    
    // 승인된 파트너만 조회
    List<WorcationPartner> findByWorcationAndApprove(Worcation worcation, CommonEnums.Approve approve);
    
    // 특정 기간의 파트너 조회
    @Query("SELECT wp FROM WorcationPartner wp " +
           "WHERE wp.worcation = :worcation " +
           "AND wp.startTime <= :endDate " +
           "AND wp.endTime >= :startDate")
    List<WorcationPartner> findByWorcationAndDateRange(
        @Param("worcation") Worcation worcation,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // 특정 회사의 파트너십 조회
    @Query("SELECT wp FROM WorcationPartner wp " +
           "WHERE wp.company.companyNo = :companyNo " +
           "AND wp.approve = :approve")
    List<WorcationPartner> findByCompanyAndApprove(
        @Param("companyNo") Long companyNo,
        @Param("approve") CommonEnums.Approve approve
    );
} 