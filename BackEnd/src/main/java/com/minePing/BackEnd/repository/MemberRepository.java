package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import static com.minePing.BackEnd.enums.CommonEnums.Status.Y;

public interface MemberRepository  extends JpaRepository<Member, Long> {
    Optional<Member> findByUserIdAndStatus(String userId, CommonEnums.Status status);
    Optional<Member> findById(Long userNo);

    @Query("select m from Member m join fetch m.company c join fetch c.departments where m.userId = :userId and m.status = :status")
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

    @Query("select m.userPwd from Member m where m.userId = :userId and m.status = :status")
    Optional<String> findUserPwdByUserId(@Param("userId") String userId, @Param("status") CommonEnums.Status status);

    @Modifying
    @Query("update Member m set m.userPwd = :updatedPwd where m.userId = :userId")
    int updatePwdByUserId(@Param("userId") String userId, @Param("updatedPwd") String updatedPwd);

    @Query("select m from Member m join fetch m.company c join fetch c.departments where m.userId = :userId and m.status = :status")
    Optional<Member> findByUserIdWithCompany(@Param("userId") String userId, @Param("status") CommonEnums.Status status);

    @Query("select m from Member m join fetch m.companyProfile where m.userId = :userId and m.status = :status")
    Optional<Member> findByUserIdWithCompanyProfile(@Param("userId") String userId, @Param("status") CommonEnums.Status status);
}
