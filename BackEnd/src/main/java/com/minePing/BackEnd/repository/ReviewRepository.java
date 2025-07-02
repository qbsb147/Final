package com.minePing.BackEnd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.minePing.BackEnd.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{
    
}
