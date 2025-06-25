package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.WorcationApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<WorcationApplication, Long> {
}