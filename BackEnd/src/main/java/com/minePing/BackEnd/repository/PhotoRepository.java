package com.minePing.BackEnd.repository;

import com.minePing.BackEnd.entity.Photo;
import com.minePing.BackEnd.entity.Worcation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    
    List<Photo> findByWorcation(Worcation worcation);
    
    void deleteByWorcation(Worcation worcation);
}
