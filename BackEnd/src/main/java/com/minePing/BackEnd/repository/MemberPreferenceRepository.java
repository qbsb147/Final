package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MemberPreferenceRepository extends JpaRepository<MemberPreference, Long> {

    Optional<MemberPreference> findByMember(Member member);

    List<MemberPreference> findByMemberAndUpdateDateAfter(Member member, LocalDate updateDateAfter);

    Optional<MemberPreference> findTopByMember_UserNoOrderByUpdateDateDesc(Long memberUserNo);
}
