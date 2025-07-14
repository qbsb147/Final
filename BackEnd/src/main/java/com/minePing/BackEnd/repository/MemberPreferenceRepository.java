package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.MemberPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MemberPreferenceRepository extends JpaRepository<MemberPreference, Long> {

    Optional<MemberPreference> findByMember_UserId(String memberUserId);
}
