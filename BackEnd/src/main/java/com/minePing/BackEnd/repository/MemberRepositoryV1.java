package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Member;
import java.util.Optional;

public interface MemberRepositoryV1 {
    Optional<Member> findMasterInfoByUserId(String userId);
    Optional<Member> findEmployeeInfoByUserId(String userId);
    Optional<Member> findWorcationInfoByUserId(String userId);
}
