package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import static com.minePing.BackEnd.enums.CommonEnums.Status.Y;

public interface MemberRepository  extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(String userId);
    Optional<Member> findById(Long userNo);

    @Query("select m from Member m join fetch m.company where m.userId = :userId and m.status = :status")
    Optional<Member> findMasterInfoByUserId(@Param("userId") String userId, @Param("status") CommonEnums.Status status);

    @Query("""
            SELECT m
            FROM Member m
            LEFT JOIN FETCH m.companyProfile cp
            LEFT JOIN FETCH cp.company
            WHERE m.userId = :userId AND m.status = :status
            """)
    Optional<Member> findEmployeeInfoByUserId(@Param("userId") String userId, @Param("status") CommonEnums.Status status);

    @Query("select m from Member m where m.userId = :userId and m.status = :status")
    Optional<Member> findWorcationInfoByUserId(@Param("userId") String userId, @Param("status") CommonEnums.Status status);

}
