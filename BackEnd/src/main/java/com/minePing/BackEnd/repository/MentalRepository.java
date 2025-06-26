package com.minePing.BackEnd.repository;



import com.minePing.BackEnd.entity.Mental;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentalRepository extends JpaRepository<Mental, Long>,MentalRepositoryV1{
    List<Mental> findByMember_UserNo(Long userNo);

}
