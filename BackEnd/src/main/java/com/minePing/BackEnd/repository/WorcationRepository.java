package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Worcation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorcationRepository extends JpaRepository<Worcation, Long> {
    // 필요하면 커스텀 쿼리도 추가 가능
}
