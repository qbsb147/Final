package com.minePing.BackEnd.repository;



import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class HealthRepositoryImpl implements HealthRepositoryV1 {
    @PersistenceContext
    private EntityManager em;
}
