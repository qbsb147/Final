package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.CompanyProfile;
import java.util.Optional;

public interface CompanyProfileRepositoryV1 {
    Optional<CompanyProfile> getCompanyNoAndApproveByUserNo(Long userNo);
}
