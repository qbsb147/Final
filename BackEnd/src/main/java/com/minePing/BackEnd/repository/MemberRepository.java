package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.ChatRoom;
import com.minePing.BackEnd.entity.Member;
import com.minePing.BackEnd.enums.CommonEnums;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberRepository  extends JpaRepository<Member, Long> {

    Optional<Member> findByPublicUuidAndStatus(UUID publicUuid, CommonEnums.Status status);

    Optional<Member> findByUserIdAndStatus(String userId, CommonEnums.Status status);

    Optional<Member> findById(Long userNo);

    @Query("select m from Member m join fetch m.companyProfile cp join fetch cp.company c join fetch c.departments where m.publicUuid = :publicUuid and m.status = :status")
    Optional<Member> findMasterInfoByPublicUuid(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    @Query("""
            SELECT m
            FROM Member m
            LEFT JOIN FETCH m.companyProfile cp
            LEFT JOIN FETCH cp.company
            WHERE m.publicUuid = :publicUuid AND m.status = :status
            """)
    Optional<Member> findEmployeeInfoByPublicUuid(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    @Query("select m from Member m where m.publicUuid = :publicUuid and m.status = :status")
    Optional<Member> findWorcationInfoByPublicUuid(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    @Query("select m.userPwd from Member m where m.publicUuid = :publicUuid and m.status = :status")
    Optional<String> findUserPwdByPublicUuid(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    @Modifying
    @Query("update Member m set m.userPwd = :updatedPwd where m.publicUuid = :publicUuid")
    int updatePwdByPublicUuid(@Param("publicUuid") UUID publicUuid, @Param("updatedPwd") String updatedPwd);

    @Query("select m from Member m join fetch m.companyProfile cp join fetch cp.company c join fetch c.departments where m.publicUuid = :publicUuid and m.status = :status")
    Optional<Member> findByPublicUuidWithCompany(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    @Query("select m from Member m join fetch m.companyProfile where m.publicUuid = :publicUuid and m.status = :status")
    Optional<Member> findByPublicUuidWithCompanyProfile(@Param("publicUuid") UUID publicUuid, @Param("status") CommonEnums.Status status);

    Optional<Member> findBySocialIdAndStatus(String socialId, CommonEnums.Status status);

    @Query("select m from Member m join fetch m.companyProfile cp where cp.company.companyNo = :companyNo and m.role = :role ")
    Optional<Member> findMaster(@Param("companyNo")Long companyNo, @Param("role") CommonEnums.Role role);

    @Query("""
select m
from Member m
join fetch m.chatParticipants cp
where cp.chatRoom = :chatRoom
and cp.member != :member
""")
    List<Member> findAllMemberByChatRoom(ChatRoom chatRoom, Member member);

    List<Member> findByPublicUuidIn(Collection<UUID> publicUuids);
}
