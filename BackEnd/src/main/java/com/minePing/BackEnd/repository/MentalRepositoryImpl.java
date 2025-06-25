package com.minePing.BackEnd.repository;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class MentalRepositoryImpl implements MentalRepositoryV1{

    @PersistenceContext
    private EntityManager em;
}
