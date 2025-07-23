package com.minePing.BackEnd.repository;



import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.Mental;

import com.minePing.BackEnd.enums.MentalEnums.Separation;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.minePing.BackEnd.enums.MentalEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MentalRepository extends JpaRepository<Mental, Long>,MentalRepositoryV1{

    Mental[] findByMemberAndUpdateDateAfter(Member member, LocalDate updateDateAfter);
    Optional<Mental> findTopByMember_UserNoAndSeparationOrderByUpdateDateDesc(Long userNo, MentalEnums.Separation separation);

    Optional<Mental> findTopByMemberAndSeparation(Member member, Separation separation);

    Optional<Mental> findTopByMember_UserNoOrderByUpdateDateDesc(Long memberUserNo);

    Mental findByMemberAndSeparation(Member member, Separation separation);
}
