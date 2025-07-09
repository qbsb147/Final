package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationPartner;
import com.minePing.BackEnd.enums.CommonEnums;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerRepository extends JpaRepository<WorcationPartner, Long> {

    @Query("SELECT wp FROM WorcationPartner wp " +
            "JOIN FETCH wp.worcation w " +
            "JOIN FETCH wp.company c " +
            "WHERE w.member.userNo = :userNo " +
            "AND wp.approve = com.minePing.BackEnd.enums.CommonEnums.Approve.W")
    List<WorcationPartner> findAllByWorcationWriter(@Param("userNo") Long userNo);


}
