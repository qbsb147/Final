package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface WorcationRepositoryV1 {
    Page<WorcationApplication> findByWorcationNosAndDate(List<Long> worcationNos, LocalDate today, Pageable pageable);
}
