package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorcationDetailRepository extends JpaRepository<WorcationDetail, Long> {
}
