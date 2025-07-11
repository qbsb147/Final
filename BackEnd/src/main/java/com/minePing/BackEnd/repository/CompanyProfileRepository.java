package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import com.minePing.BackEnd.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long>, CompanyProfileRepositoryV1 {
    Optional<CompanyProfile> findByMember(Member member);
}
