package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationFeatures;
import com.minePing.BackEnd.enums.WorcationEnums;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorcationFeaturesRepository extends JpaRepository<WorcationFeatures, Long>, WorcationFeaturesRepositoryV1 {
    

}
