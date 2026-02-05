package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import com.minePing.BackEnd.entity.WorcationApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface WorcationRepositoryV1 {
    Page<WorcationApplication> findByWorcationNosAndDate(List<Long> worcationNos, LocalDate today, Pageable pageable);
    
    // 전체 워케이션을 fetch-join 으로 불러오되 페이지네이션을 적용한 구현
    Page<Worcation> findAllWithAllDetails(Pageable pageable);
}
