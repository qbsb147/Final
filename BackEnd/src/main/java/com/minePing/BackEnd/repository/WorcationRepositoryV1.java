package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorcationRepositoryV1 {
    Page<WorcationApplication> findByUserNo(Long userNo, Pageable pageable);

}
