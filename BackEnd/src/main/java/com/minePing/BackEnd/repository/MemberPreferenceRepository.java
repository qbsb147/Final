package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.MemberPreference;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface MemberPreferenceRepository extends JpaRepository<MemberPreference, Long> {
    @Query("SELECT p FROM MemberPreference p WHERE p.member.userNo = :user_no")
    List<MemberPreference> getMemberPreferenceByUserNo(@Param("user_no")Long user_no);

    Optional<MemberPreference> findTopByMember_UserNoOrderByUpdateDateDesc(Long userNo);


    Optional<MemberPreference> findByMember_UserId(String memberUserId);

    List<MemberPreference> findByMember_UserIdAndUpdateDateAfter(String memberUserId, LocalDate updateDateAfter);

}
