package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.MemberRecommand;
import com.minePing.BackEnd.entity.Worcation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WorcationFeaturesRepositoryV1 {
    Page<Worcation> findAllFilter(MemberRecommand memberRecommand, Pageable pageable);
}
