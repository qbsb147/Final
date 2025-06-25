package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationFeatures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorcationFeaturesRepository extends JpaRepository<WorcationFeatures, Long> {
}
