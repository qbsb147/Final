package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Department;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.entity.MemberRecommand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MemberRecommandRepository extends JpaRepository<MemberRecommand, Long> {

    Optional<MemberRecommand> findTopByMemberAndCreateTimeAfter(Member member, LocalDateTime createTimeAfter);
}
